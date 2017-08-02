const Feed = require('./feed');
const types = require('../types');

class HackerNoon extends Feed {
  constructor() {
    super('https://hackernoon.com/feed', types.HackerNoon);
  }
}

module.exports = new HackerNoon();
