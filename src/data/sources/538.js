const Feed = require('./feed');

class FiveThirtyEight extends Feed {
  constructor() {
    super('https://fivethirtyeight.com/features/feed/');
  }
}

module.exports = new FiveThirtyEight();
