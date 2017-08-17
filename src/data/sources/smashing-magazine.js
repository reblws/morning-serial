const Feed = require('./feed');
const types = require('../types');

const SmashingMagazine = new Feed('https://www.smashingmagazine.com/feed/', types.SmashingMagazine, 'https://www.smashingmagazine.com/');

module.exports = SmashingMagazine;
