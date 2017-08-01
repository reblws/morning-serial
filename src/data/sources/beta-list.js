const Feed = require('./feed');

class BetaList extends Feed {
  constructor() {
    super('http://feeds.feedburner.com/BetaList');
  }
}

module.exports = new BetaList();
