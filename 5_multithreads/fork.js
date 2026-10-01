const { countMultipleOfThreeInArray } = require("./count");

process.on("message", (msg) => {
  process.send(countMultipleOfThreeInArray(msg));
  process.disconnect();
});
