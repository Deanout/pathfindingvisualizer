var SimplexNoise = require("../libraries/simplex-noise.js");

export function noiseWalls(width, height) {
  let config = store.simplex;
  var simplex = new SimplexNoise(config.seed);
  const wallsToBuild = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      var noise2D = simplex.noise2D(row / config.scale, col / config.scale);
      if (noise2D > config.threshold) {
        wallsToBuild.push([row, col]);
      }
    }
  }
  return wallsToBuild;
}
