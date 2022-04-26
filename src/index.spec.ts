// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
expect.extend(matchers);

type Operators = "+" | "-" | "*" | "/";
type Operand = number;

const rpn = (n1: number, n2: number, op: string):number => {
  switch (op) {
    case '-':
      return n1 - n2;
    case '*':
      return n1 * n2;
    case '/':
      return n1 / n2;
    default:
      return n1 + n2;
  }
}
 const rpnNested = (rpnCalcul: (Operators | Operand)[]): number => {
   const calculResult = rpnCalcul.reduce(rpnCalculReducer, [])
   return calculResult[0];
 }

const isOperator = (calculElement: Operators | Operand):calculElement is Operators => {
  return  calculElement === "+" ||  calculElement === "-" ||  calculElement === "*" ||  calculElement === "/";
}

const rpnCalculReducer =
  (stack: number[], cur: Operators | Operand) => {
    if (isOperator(cur)){
      const operationResult = rpn(stack[stack.length-2], stack[stack.length-1], cur)
      for (let i=0; i<2; i++){
        stack.pop()
      }
      stack.push(operationResult)
    }
    else {
      stack.push(cur)
    }
    return stack
  }

it("rpn 1 + 1", function () {
  const actual = rpn(1, 1, '+')
  expect(actual).toEqual(2);
});

it("rpn 1 + 2", function () {
  const actual = rpn(1, 2, '+')
  expect(actual).toEqual(3);
});

it("rpn 1 - 1", function () {
  const actual = rpn(1, 1, '-')
  expect(actual).toEqual(0);
});

it("rpn 1 * 1", function () {
  const actual = rpn(1, 1, '*')
  expect(actual).toEqual(1);
});

it("rpn 4 / 2", function () {
  const actual = rpn(4, 2, '/')
  expect(actual).toEqual(2);
});

it("rpn 1 + 3 - 2", function () {
  const actual = rpnNested( [1, 3, "+", 2, "-"])
  expect(actual).toEqual(2);
});

it("rpn 1 + 3 - 2", function () {
  const actual = rpnNested( [100, 10, 1, "+", "+"])
  expect(actual).toEqual(111);
});