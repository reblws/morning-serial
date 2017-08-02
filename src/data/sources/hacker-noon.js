const Feed = require('./feed');
const types = require('../types');

const HackerNoon = new Feed('https://hackernoon.com/feed', types.HackerNoon);

module.exports = HackerNoon;
