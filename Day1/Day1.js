const R = require('ramda');
const fs = require('fs');

const path = './Day1Input.text';
const fileContent = fs.readFileSync(path, 'utf8');

// Part 1
const splitColumns = R.map(R.split(/\s/));
const convertToNumbers = R.map(R.map(Number));
const transpose = R.transpose;
const sortColumns = R.map(R.sort(R.ascend(R.identity)));
const computeDifferences = R.pipe(
  R.apply(R.zip),
  R.map(([a, b]) => Math.abs(a - b)),
  R.sum
);

const passThroughLog = (val) => {
  console.log(val);
  return val;
};

const processFileContent = R.pipe(
  R.split('\n'), // string -> [string]
  R.map(R.replace(/\s+/, ' ')) // [string] -> [string]
);

const processPartOneInput = R.pipe(
  processFileContent,
  splitColumns,
  convertToNumbers,
  transpose,
  sortColumns,
  computeDifferences,
  passThroughLog
);

processPartOneInput(fileContent);

// Part 2

const findOccurrences = R.converge(
  (col1, col2) =>
    R.pipe(R.map((num) => R.multiply(num, R.count(R.equals(num), col2))))(col1),
  [R.head, R.last]
);

const processPartTwoInput = R.pipe(
  processFileContent,
  splitColumns,
  convertToNumbers,
  transpose, // [[column1], [column2]]
  findOccurrences,
  R.sum,
  passThroughLog
);

processPartTwoInput(fileContent);
