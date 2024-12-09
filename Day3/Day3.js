const R = require('ramda');
const fs = require('fs');

const passThroughLog = (val) => {
  console.log(val);
  return val;
};

//Part One
const regex = /mul\((\d+),(\d+)\)/g;
const regexTwo = /mul\((\d+),(\d+)\)/;

const processInput = R.partialRight(fs.readFileSync, ['utf8']);
const filterSubstring = R.pipe(R.match(regex), R.map(R.match(regexTwo)));
R.pipe(
  processInput,
  filterSubstring,
  R.map(R.converge(R.multiply, [R.nth(1), R.nth(2)])),
  R.sum,
  passThroughLog
)('./Day3Input.txt');

//Part Two

const regexConditional = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
const reducerFn = (acc, instr) => {
  if (instr === 'do()') {
    return [acc[0], true];
  } else if (instr === "don't()") {
    return [acc[0], false];
  } else {
    if (acc[1]) {
      const newSum = R.converge(R.multiply, [R.nth(1), R.nth(2)])(
        R.match(regexTwo, instr)
      );

      return [R.add(newSum, acc[0]), true];
    } else {
      return [acc[0], false];
    }
  }
};

const reducer = R.reduce(reducerFn, [0, true]);

const filterSubstringConditional = R.match(regexConditional);
R.pipe(
  processInput,
  filterSubstringConditional,
  reducer,
  R.head,
  passThroughLog
)('./Day3Input.txt');
