const Feed = require('./feed');
const types = require('../types');

const TheOutline = new Feed('https://theoutline.com/feeds/recent.rss', types.TheOutline);

module.exports = TheOutline;
