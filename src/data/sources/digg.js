

const Feed = require('./feed');
const types = require('../types');

const Digg = new Feed('http://digg.com/rss/top.rss', types.Digg);

module.exports = Digg;
