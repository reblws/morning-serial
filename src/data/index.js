const types = require('./types');

const dataSources = Object.keys(types).reduce((acc, type) => {
  let typeString = types[type];
  acc[type] = require(`./sources/${typeString}`);
  return acc;
}, {});

module.exports = dataSources;
