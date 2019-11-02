var nodesToAnimate = [];
export function recursiveWallBuilder() {
  const coords = [];
  nodesToAnimate = [];

  for (let row = 0; row < store.gridHeight; row++) {
    let currentRow = [];
    for (let col = 0; col < store.gridWidth; col++) {
      currentRow.push(store.air);
    }
    coords.push(currentRow);
  }
  for (let i = 0; i < store.gridWidth; i++) {
    nodesToAnimate.push([0, i]);
    coords[0][i] = store.wall;
  }
  for (let i = 1; i < store.gridHeight; i++) {
    nodesToAnimate.push([i, store.gridWidth - 1]);
    coords[i][store.gridWidth - 1] = store.wall;
  }
  for (let i = store.gridWidth - 2; i >= 0; i--) {
    nodesToAnimate.push([store.gridHeight - 1, i]);
    coords[store.gridHeight - 1][i] = store.wall;
  }
  for (let i = store.gridHeight - 2; i > 0; i--) {
    nodesToAnimate.push([i, 0]);
    coords[i][0] = store.wall;
  }

  const walls = helper(
    coords,
    0,
    store.gridWidth - 1,
    0,
    store.gridHeight - 1,
    store.wall,
    store.air
  );
  walls[store.startPosition[0]][store.startPosition[1]] = store.air;
  walls[store.finishPosition[0]][store.finishPosition[1]] = store.air;
  return nodesToAnimate;
}

function helper(inputCoords, x1, x2, y1, y2, WALL, AIR) {
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
          nodesToAnimate.push([i, bisection]);
          inputCoords[i][bisection] = WALL;
        }
      }
      helper(inputCoords, x1, bisection, y1, y2, WALL, AIR);
      helper(inputCoords, bisection, x2, y1, y2, WALL, AIR);
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
          nodesToAnimate.push([bisection, i]);
          inputCoords[bisection][i] = WALL;
        }
      }
      helper(inputCoords, x1, x2, y1, bisection, WALL, AIR);
      helper(inputCoords, x1, x2, bisection, y2, WALL, AIR);
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
