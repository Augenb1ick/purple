const { countMultipleOfThreeInArray } = require("./count");

const { fork } = require("child_process");

const observer = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name} duration:${entry.duration}`);
  });
});

observer.observe({ entryTypes: ["measure"] });

const bigArray = Array.from({ length: 90_000_000 }, (_, index) => index + 1);

function chunkArray(array, n) {
  const chunkSize = Math.ceil(array.length / n);
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}

const bigChunkedArray = chunkArray(bigArray, 8);

function forkFunction(array) {
  return new Promise((resolve, reject) => {
    const child = fork("./fork.js");
    child.send(array);

    child.on("message", (msg) => {
      resolve(msg);
    });
  });
}

const calculate = (array) => {
  performance.mark("calc start");

  const result = countMultipleOfThreeInArray(array);

  performance.mark("calc end");
  performance.measure("calc", "calc start", "calc end");
  console.log(result);
};

const calculateWithFork = async (cunkedArray) => {
  performance.mark("calcWithFork start");

  const results = await Promise.all(cunkedArray.map(forkFunction));
  const result = results.reduce((a, b) => a + b, 0);

  performance.mark("calcWithFork end");
  performance.measure("calcWithFork", "calcWithFork start", "calcWithFork end");
  console.log(result);
};

calculate(bigArray);

calculateWithFork(bigChunkedArray);
