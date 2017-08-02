module.exports = function valueSeq(object) {
  return Object.keys(object).map(key => object[key]);
}
