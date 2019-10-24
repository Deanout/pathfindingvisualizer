export function recursiveWallBuilder(
  width,
  height,
  startNodeRow,
  startNodeCol,
  endNodeRow,
  endNodeCol,
  wall,
  passage,
  air
) {
  const coords = [];
  for (let row = 0; row < height; row++) {
    let currentRow = [];
    for (let col = 0; col < width; col++) {
      currentRow.push(air);
    }
    coords.push(currentRow);
  }
  for (let i = 0; i < width; i++) {
    coords[0][i] = wall;
    coords[height - 1][i] = wall;
  }
  for (let i = 1; i < height - 1; i++) {
    coords[i][0] = wall;
    coords[i][width - 1] = wall;
  }

  const walls = helper(coords, 0, width - 1, 0, height - 1, wall, passage, air);
  walls[startNodeRow][startNodeCol] = air;
  walls[endNodeRow][endNodeCol] = air;
  return walls;
}

function helper(inputCoords, x1, x2, y1, y2, WALL, PASSAGE, AIR) {
  let width = x2 - x1;
  let height = y2 - y1;

  if (width >= height) {
    // Vertical bisection
    if (x2 - x1 > 3) {
      let bisection = Bisect(x1, x2);
      let max = Max(y2);
      let min = Min(y1);
      let passage = Passage(max, min);
      let first = false;
      let second = false;

      if (inputCoords[y2][bisection] === AIR) {
        passage = max;
        first = true;
      }
      if (inputCoords[y1][bisection] === AIR) {
        passage = min;
        second = true;
      }

      for (let i = y1 + 1; i < y2; i++) {
        if (first && second) {
          if (i === max || i === min) {
            inputCoords[i][bisection] = AIR;
          }
        } else if (i === passage) {
          inputCoords[i][bisection] = AIR;
        } else {
          inputCoords[i][bisection] = WALL;
        }
      }
      helper(inputCoords, x1, bisection, y1, y2, WALL, PASSAGE, AIR);
      helper(inputCoords, bisection, x2, y1, y2, WALL, PASSAGE, AIR);
    }
  } else {
    if (y2 - y1 > 3) {
      let bisection = Bisect(y1, y2);
      let max = Max(x2);
      let min = Min(x1);
      let passage = Passage(max, min);
      let first = false;
      let second = false;

      if (inputCoords[bisection][x2] === AIR) {
        passage = max;
        first = true;
      }
      if (inputCoords[bisection][x1] === AIR) {
        passage = min;
        second = true;
      }

      for (let i = x1 + 1; i < x2; i++) {
        if (first && second) {
          if (i === max || i === min) {
            inputCoords[bisection][i] = AIR;
          }
        } else if (i === passage) {
          inputCoords[bisection][i] = AIR;
        } else {
          inputCoords[bisection][i] = WALL;
        }
      }
      helper(inputCoords, x1, x2, y1, bisection, WALL, PASSAGE, AIR);
      helper(inputCoords, x1, x2, bisection, y2, WALL, PASSAGE, AIR);
    }
  }

  return inputCoords;
}

function Passage(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Bisect(a, b) {
  return Math.ceil((a + b) / 2);
}

function Max(a) {
  return a - 1;
}

function Min(a) {
  return a + 1;
}
