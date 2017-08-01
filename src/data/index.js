const types = require('./types');

module.exports = Object.keys(types).reduce((acc, type) => {
  let typeString = types[type];
  acc[type] = require(`./sources/${typeString}`);
  return acc;
}, {});

