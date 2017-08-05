const url = require('url');

function capitalizeFirstLetter(letter, index) {
  return index === 0
    ? letter.toUpperCase()
    : letter;
}

function capitalize(word) {
  return word.split('').map(capitalizeFirstLetter).join('');
}

module.exports = {
  toHumanName: type => type.split('-').map(capitalize).join(' '),
  toTableName: type => type.replace(/\W/g, ''),
  hostName: href => url.parse(href).host,
  findFavicon: href => `https://icons.better-idea.org/icon?url=${href}&size=80..120..200`,
  valueSeq: object => Object.keys(object).map(key => object[key]),
}
