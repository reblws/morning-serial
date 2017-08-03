const Feed = require('./feed');
const types = require('../types');

const FiveThirtyEight = new Feed('https://fivethirtyeight.com/features/feed/', types.FiveThirtyEight);

module.exports = FiveThirtyEight;
