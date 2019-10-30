export function randomWalls(width, height) {
  const wallsToBuild = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      let threshold = Math.random() * 10;
      if (threshold > 7) {
        wallsToBuild.push([row, col]);
      }
    }
  }

  return wallsToBuild;
}
