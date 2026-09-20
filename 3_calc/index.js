const add = require("./add");
const subtract = require("./subtract");
const multiply = require("./multiply");
const divide = require("./divide");

const calculate = () => {
  const firstNumber = parseFloat(process.argv[2]);
  const secondNumber = parseFloat(process.argv[3]);
  const operation = process.argv[4];

  switch (operation) {
    case "add":
      return add(firstNumber, secondNumber);
    case "subtract":
      return subtract(firstNumber, secondNumber);
    case "multiply":
      return multiply(firstNumber, secondNumber);
    case "divide":
      return divide(firstNumber, secondNumber);
    default:
      throw new Error("Invalid operation");
  }
};

console.log(calculate());
