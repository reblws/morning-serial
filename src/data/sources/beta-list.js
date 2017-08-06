const Feed = require('./feed');
const types = require('../types');

const BetaList = new Feed('http://feeds.feedburner.com/BetaList', types.BetaList, 'https://betalist.com/');

module.exports = BetaList;
