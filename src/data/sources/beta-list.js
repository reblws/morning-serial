const Feed = require('./feed');
const types = require('../types');

class BetaList extends Feed {
  constructor() {
    super('http://feeds.feedburner.com/BetaList', types.BetaList);
  }
}

module.exports = new BetaList();
