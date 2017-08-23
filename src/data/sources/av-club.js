const Feed = require('./feed');
const types = require('../types');

const AVClub = new Feed('http://www.avclub.com/rss/', types.AVClub)

module.exports = AVClub;
