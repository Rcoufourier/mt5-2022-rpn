// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from "jest-extended";
expect.extend(matchers);

type BinaireOperators = "+" | "-" | "*" | "/" ;
type UnaireOperator = "NEGATE";
type Operand = number;
type CalculElement =  BinaireOperators | UnaireOperator | Operand

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
const rpnNested = (rpnCalcul: CalculElement[]): number => {
 const calculResult = rpnCalcul.reduce(rpnCalculReducer, [])
 return calculResult[0];
}

const isBinaireOperator = (calculElement: CalculElement):calculElement is BinaireOperators => {
  return  calculElement === "+" ||  calculElement === "-" ||  calculElement === "*" ||  calculElement === "/";
}

const isNegateOperator = (calculElement: CalculElement):calculElement is UnaireOperator => {
  return  calculElement === "NEGATE";
}

const rpnCalculReducer =
  (stack: number[], cur: CalculElement) => {
  let updatedStack = stack
    if (isBinaireOperator(cur)){
      return doBinaireOperation(updatedStack)(cur);
    }
    if(isNegateOperator(cur)) {
      return doNegateOperation(updatedStack)
    }
    updatedStack.push(cur)
    return updatedStack
  }

  const doBinaireOperation = (currentStack: number[]) => (operation: BinaireOperators) => {
    const operationResult = rpn(currentStack[currentStack.length-2], currentStack[currentStack.length-1], operation)
    currentStack.pop()
    currentStack[currentStack.length-1] = operationResult
    return currentStack
  }

  const doNegateOperation = (currentStack: number[]) => {
    currentStack[currentStack.length-1] = currentStack[currentStack.length-1] * -1
    return currentStack
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

it("rpn 2 NEGATE", function () {
  const actual = rpnNested( [2, "NEGATE"])
  expect(actual).toEqual(-2);
});

it("rpn NEGATE (3 + 2)", function () {
  const actual = rpnNested( [3, 2,"+", "NEGATE"])
  expect(actual).toEqual(-5);
});

it("rpn 3 + -2", function () {
  const actual = rpnNested( [3, 2, "NEGATE", "+"])
  expect(actual).toEqual(1);
});