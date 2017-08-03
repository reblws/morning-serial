const url = require('url');

function capitalizeFirstLetter(letter, index) {
  return index === 0
    ? letter.toUpperCase()
    : letter;
}

function capitalize(str) {
  return str.split('').map(capitalizeFirstLetter).join('');
}

module.exports = {
  toHumanName: type => type.split('-').map(capitalize).join(' '),
  toTableName: type => type.replace(/\W/g, ''),
  hostName: href => url.parse(href).host,
  valueSeq: object => Object.keys(object).map(key => object[key]),
}
