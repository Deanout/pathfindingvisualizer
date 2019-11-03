export function randomWalls() {
  const wallsToBuild = [];
  const wall = store.wall;
  const grass = store.grass;

  for (let row = 0; row < store.gridHeight; row++) {
    for (let col = 0; col < store.gridWidth; col++) {
      let threshold = Math.random() * 10;
      if (threshold > 7) {
        wallsToBuild.push([row, col, wall]);
      } else {
        wallsToBuild.push([row, col, grass]);
      }
    }
  }

  return wallsToBuild;
}
