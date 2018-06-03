/**
 * Returns random number between min and max inclusive.
 *
 * @param {number} min
 * @param {number} max
 *
 * @public
 */
function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * ((newMax - newMin) + 1)) + newMin;
}

module.exports = {
  getRandomIntInclusive,
};
