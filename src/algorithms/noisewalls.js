var SimplexNoise = require("../libraries/simplex-noise.js");

export function simplexTerrain() {
  let config = store.simplex;
  let persistence = config.persistence.value;
  let lacunarity = config.lacunarity.value;
  var simplex = new SimplexNoise(config.seed.value);
  const wallsToBuild = [];
  for (let row = 0; row < store.gridHeight; row++) {
    for (let col = 0; col < store.gridWidth; col++) {
      let total = 0;
      let frequency = 1;
      let amplitude = 1;
      let maxValue = 0;
      for (let octave = 0; octave < config.octave.value; octave++) {
        total +=
          simplex.noise2D(
            (row / config.scale.value) * frequency,
            (col / config.scale.value) * frequency
          ) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
      }
      let scaled2D = scaleBetween(total, 0, 1, -maxValue, maxValue);

      for (let i = 0; i < store.nodeTypes.length; i++) {
        let nodeType = store.nodeTypes[i];

        if (
          scaled2D <= nodeType.minThreshold ||
          scaled2D > nodeType.maxThreshold
        ) {
          continue;
        } else {
          wallsToBuild.push([row, col, nodeType]);
          break;
        }
      }
    }
  }
  return wallsToBuild;
}

const scaleBetween = (unscaledNum, newMin, newMax, oldMin, oldMax) => {
  return (
    ((newMax - newMin) * (unscaledNum - oldMin)) / (oldMax - oldMin) + newMin
  );
};
