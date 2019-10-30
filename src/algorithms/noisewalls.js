var SimplexNoise = require("../libraries/simplex-noise.js");

export function noiseWalls(width, height) {
  let seed = Math.random() * 10000;
  var simplex = new SimplexNoise(seed);
  const wallsToBuild = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      var noise2D = simplex.noise2D(row / 10, col / 10);
      if (noise2D > 0.5) {
        wallsToBuild.push([row, col]);
      }
    }
  }
  return wallsToBuild;
}
