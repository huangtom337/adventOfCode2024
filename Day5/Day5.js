const R = require('ramda');
const { processInput } = require('../util');

// acc : {seen: [], isCorrect: boolean}
const reducerFn = (rules, acc, input) => {
  const processed = R.reduce(
    (accInner, elem) => {
      const ruleValues = rules[elem] || [];
      const hasMatch = R.any((x) => R.includes(x, ruleValues))(accInner.seen);

      return {
        seen: R.prepend(elem, accInner.seen),
        isCorrect: accInner.isCorrect && !hasMatch,
      };
    },
    { seen: [], isCorrect: true },
    input
  );

  return R.append(processed, acc);
};

R.pipe(
  processInput,
  R.split('\n\n'),
  R.map(R.split('\n')),
  ([rules, input]) => ({ rules, input }),
  R.evolve({
    rules: R.pipe(R.map(R.split('|')), R.groupBy(R.head), R.map(R.map(R.last))),
    input: R.map(R.pipe(R.split(','))),
  }),
  R.converge(
    (rules, input) =>
      R.reduce(
        (acc, inputArray) => reducerFn(rules, acc, inputArray),
        [],
        input
      ),
    [R.prop('rules'), R.prop('input')]
  ),
  R.filter(R.propEq(true, 'isCorrect')),
  R.map(R.prop('seen')),
  R.map(
    R.converge(R.nth, [
      R.pipe(R.length, (len) => Math.floor(len / 2)),
      R.identity,
    ])
  ),
  R.map(Number),
  R.sum,
  R.tap(console.log)
)('./Day5Input.txt');

// - For each num
//   - Get all of its paired values
//   - Check if in its paired value if it exists in visited set, fail if true
//   - Add current num to visited set
// R.pipe(R.map())(processedSmallInput.input);

// Part Two

const dfs = (node, stack, visited, rules) => {
  if (visited.has(node)) {
    return;
  }
  visited.add(node);
  if (rules[node]) {
    for (const neighbour of rules[node]) {
      dfs(neighbour, stack, visited, rules);
    }
  }

  // After visiting all dependencies, push the node to the stack
  stack.push(node);
};

// Input: number[]
// Rules: dependency map
const topologicalSort = (input, rules) => {
  // visit function
  const visited = new Set([]);
  const stack = [];
  for (const node of input) {
    dfs(node, stack, visited, rules);
  }

  return stack.reverse();
};

const reducerFnTwo = (rules, acc, input) => {
  const filteredRules = R.pipe(
    R.pickBy((destList, src) => R.includes(src, input)),
    R.map((destList) => R.filter((dest) => R.includes(dest, input), destList))
  )(rules);

  const sorted = topologicalSort(input, filteredRules);
  return R.append(sorted, acc);
};

// find all seen elements that exists in ruleValues
// find the smallest index of input
// insert current element in front of said smallest index seen element
// repeat

const resultArr = R.pipe(
  processInput,
  R.split('\n\n'),
  R.map(R.split('\n')),
  ([rules, input]) => ({ rules, input }),
  R.evolve({
    rules: R.pipe(R.map(R.split('|')), R.groupBy(R.head), R.map(R.map(R.last))),
    input: R.map(R.pipe(R.split(','))),
  }),
  R.converge(
    (rules, input) => ({
      input,
      processedInput: R.reduce(
        (acc, inputArray) => reducerFnTwo(rules, acc, inputArray),
        [],
        input
      ),
    }),
    [R.prop('rules'), R.prop('input')]
  ),
  ({ input, processedInput }) => R.zip(input, processedInput)
)('./Day5Input.txt');

let finalResult = [];

for (const result of resultArr) {
  const [originalArr, processedArr] = result;
  if (!R.equals(originalArr, processedArr)) {
    finalResult = [
      ...finalResult,
      processedArr[Math.floor(processedArr.length / 2)],
    ];
  }
}

R.pipe(R.map(Number), R.sum, R.tap(console.log))(finalResult);
