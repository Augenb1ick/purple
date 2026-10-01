module.exports = {
  countMultipleOfThreeInArray: (array) => {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] % 3 === 0) count++;
    }
    return count;
  },
};
