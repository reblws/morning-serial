const Feed = require('./feed');
const types = require('../types');

const TechCrunch = new Feed('https://techcrunch.com/feed/', types.TechCrunch);

module.exports = TechCrunch;
