const eventEmitter = require("events");
const add = require("./add");
const subtract = require("./subtract");
const multiply = require("./multiply");
const divide = require("./divide");

const emitter = new eventEmitter();

const firstNumber = parseFloat(process.argv[2]);
const secondNumber = parseFloat(process.argv[3]);
const operation = process.argv[4];

emitter.on('add', () => console.log(add(firstNumber, secondNumber)));
emitter.on('subtract', () => console.log(subtract(firstNumber, secondNumber)));
emitter.on('multiply', () => console.log(multiply(firstNumber, secondNumber)));
emitter.on('divide', () => console.log(divide(firstNumber, secondNumber)));

emitter.emit(operation)