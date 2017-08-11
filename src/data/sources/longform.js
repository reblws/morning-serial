const Feed = require('./feed');
const types = require('../types');

const Longform = new Feed('https://longform.org/feed.rss', types.Longform);

module.exports = Longform;
