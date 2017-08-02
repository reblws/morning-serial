const Feed = require('./feed');
const types = require('../types');

const IndieHackers = new Feed('https://www.indiehackers.com/feed.xml', types.IndieHackers);

module.exports = IndieHackers;
