const R = require('ramda');
const fs = require('fs');

const passThroughLog = (val) => {
  console.log(val);
  return val;
};

const processFileContent = R.split('\n');
const processedInput = R.pipe(
  R.partialRight(fs.readFileSync, ['utf8']),
  processFileContent,
  R.map(R.split(''))
)('./Day4Input.txt');

// input: [['a','b','c','d'], ['b','c','a','d']], nxm arrays
// word = [[x,y], [x2,y2], ...]
const wordSearch = (input) => {
  const dfs = (i, j, directionX, directionY, word, visited) => {
    // Potential XMAS
    if (word.length === 4) {
      // Parsing word
      const parsedWord = word
        .map((val) => {
          const x = val[0];
          const y = val[1];
          return input[x][y];
        })
        .join('');

      if (parsedWord === 'XMAS') {
        return 1;
      } else {
        return 0;
      }
    }
    // Out of bounds check
    if (i < 0 || i >= input.length || j < 0 || j >= input[0].length) {
      return 0;
    }

    // Encoding for set duplication coordinate check
    const encodedVisit = JSON.stringify([i, j]);
    visited.add(encodedVisit);

    const new_i = i + directionX;
    const new_j = j + directionY;

    const newWord = [...word, [i, j]];
    // If next visit has already been visited, skip. (Think going backwards)
    const encodedNextVisit = JSON.stringify([new_i, new_j]);
    if (visited.has(encodedNextVisit)) {
      return 0;
    }

    return dfs(new_i, new_j, directionX, directionY, newWord, visited);
  };

  let total = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const directions = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
      ];

      for (const direction of directions) {
        total += dfs(i, j, direction[0], direction[1], [], new Set([]));
      }
    }
  }

  return total;
};

console.log(wordSearch(processedInput));

//Part Two

const wordSearchTwo = (input) => {
  const checkInBounds = (i, j) => {
    if (i < 0 || i >= input.length || j < 0 || j >= input[0].length) {
      return false;
    }

    return true;
  };
  const dfs = (i, j) => {
    // Out of bounds check
    if (
      !checkInBounds(i + 1, j + 1) ||
      !checkInBounds(i - 1, j - 1) ||
      !checkInBounds(i + 1, j - 1) ||
      !checkInBounds(i - 1, j + 1)
    ) {
      return 0;
    }

    // Append diagonal letters of 'A'
    const currentLetter = input[i][j];
    const upperRight = input[i + 1][j + 1];
    const lowerLeft = input[i - 1][j - 1];
    const wordOne = R.pipe(
      R.concat(currentLetter),
      R.concat(lowerLeft)
    )(upperRight);

    const upperLeft = input[i - 1][j + 1];
    const lowerRight = input[i + 1][j - 1];
    const wordTwo = R.pipe(
      R.concat(currentLetter),
      R.concat(lowerRight)
    )(upperLeft);

    // Check that the diagonal forms 'MAS'
    if (
      (wordOne === 'MAS' || [...wordOne].reverse().join('') === 'MAS') &&
      (wordTwo === 'MAS' || [...wordTwo].reverse().join('') === 'MAS')
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  let total = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const letter = input[i][j];
      if (letter === 'A') {
        total += dfs(i, j);
      }
    }
  }

  return total;
};
console.log(wordSearchTwo(processedInput));

// If input[i][j] === 'A', initial dfs
// traverse in each diagonal direction one step
// check if 'M' and 'S' exists
// 'M' and 'S' cannot be on the same diagonal
// continue
