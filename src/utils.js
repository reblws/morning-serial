module.exports = {
  toTableName: type => type.replace(/\W/g, ''),
  valueSeq: object => Object.keys(object).map(key => object[key]),
}
