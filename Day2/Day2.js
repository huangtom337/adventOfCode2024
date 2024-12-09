const R = require('ramda');
const fs = require('fs');

const processFileContent = R.pipe(
  R.partialRight(fs.readFileSync, ['utf8']),
  R.split('\n'), // ["asdasd", "asdasd", "asdasd"]
  R.map(R.split(/\s/)),
  R.map(R.map(Number))
);

const filterContent = (arr) => {
  const arr2 = R.sort((a, b) => a - b, arr).join(',');
  const arr3 = R.sort((a, b) => b - a, arr).join(',');

  return arr2 === arr.join(',') || arr3 === arr.join(',');
};

const reduceComparison = (acc, value) => {
  if (acc[1] === null) {
    return [true, value];
  }

  const numBefore = acc[1];

  if (!acc[0]) {
    return [false, value];
  }

  const difference = Math.abs(R.subtract(numBefore, value));
  if (difference > 3 || difference < 1) {
    return [false, value];
  } else {
    return [true, value];
  }
};
// (0, 0) (fail/success, numBefore)
const calculateDifferences = R.map(R.reduce(reduceComparison, [true, null]));

const passThroughLogs = (content) => {
  console.log(content);
  return content;
};

R.pipe(
  processFileContent,
  R.filter(filterContent),
  calculateDifferences,
  R.filter(R.head),
  R.length,
  passThroughLogs
)('./Day2Input.txt');

// Part 2

const removeAtEachPosition = (arr) =>
  R.map((i) => R.remove(i, 1, arr), R.range(0, arr.length));

R.pipe(
  processFileContent,
  R.map(removeAtEachPosition),
  R.map(R.filter(filterContent)),
  R.map(calculateDifferences),
  R.map(R.filter(R.head)),
  R.map(R.pipe(R.length, R.gte(R.__, 1))),
  R.filter(R.identity),
  R.length,
  passThroughLogs
)('./Day2Input.txt');
