const url = require('url');

const capitalizeFirstLetter = (letter, index) => index === 0
  ? letter.toUpperCase()
  : letter;
const capitalize = word => word.split('').map(capitalizeFirstLetter).join('');
const valueSeq = object => Object.keys(object).map(key => object[key]);


module.exports = {
  toHumanName: type => type.split('-').map(capitalize).join(' '),
  toTableName: type => type.replace(/\W/g, ''),
  hostName: href => url.parse(href).host,
  findFavicon: href => `https://icons.better-idea.org/icon?url=${href}&size=80..120..200`,
  valueSeq,
  findSource: (data, typeName) =>
    valueSeq(data).filter(x => x.type === typeName)[0],
  identity: x => x,
};
