const Feed = require('./feed');
const types = require('../types');

class FiveThirtyEight extends Feed {
  constructor() {
    super('https://fivethirtyeight.com/features/feed/', types.FiveThirtyEight);
  }
}

module.exports = new FiveThirtyEight();
