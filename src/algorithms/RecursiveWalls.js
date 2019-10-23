export function BuildRecursiveWalls(coords, x1, x2, y1, y2) {
  let width = x2 - x1;
  let height = y2 - y1;

  console.log(coords);
  if (width >= height) {
    // Vertical bisection
    if (x2 - x1 > 3) {
      let bisection = Bisect(x1, x2);
      let max = Max(y2);
      let min = Min(y1);
      let passage = Passage(max, min);
      let first = false;
      let second = false;

      if (coords[y2][bisection] === 0) {
        passage = max;
        first = true;
      }
      if (coords[y1][bisection] === 0) {
        passage = min;
        second = true;
      }

      for (let i = y1 + 1; i < y2; i++) {
        if (first && second) {
          if (i === max || i === min) {
            continue;
          }
        } else if (i === passage) {
          continue;
        }
        coords[i][bisection] = 1;
      }
      BuildRecursiveWalls(coords, x1, bisection, y1, y2);
      BuildRecursiveWalls(coords, bisection, x2, y1, y2);
    }
  } else {
    if (y2 - y1 > 3) {
      let bisection = Bisect(y1, y2);
      let max = Max(x2);
      let min = Min(x1);
      let passage = Passage(max, min);
      let first = false;
      let second = false;

      if (coords[bisection][x2] === 0) {
        passage = max;
        first = true;
      }
      if (coords[bisection][x1] === 0) {
        passage = min;
        second = true;
      }

      for (let i = x1 + 1; i < x2; i++) {
        if (first && second) {
          if (i === max || i === min) {
            continue;
          }
        } else if (i === passage) {
          continue;
        }
        coords[bisection][i] = 1;
      }
      BuildRecursiveWalls(coords, x1, x2, y1, bisection);
      BuildRecursiveWalls(coords, x1, x2, bisection, y2);
    }
  }

  return coords;
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
