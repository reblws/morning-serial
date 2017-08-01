const Feed = require('./feed');
const types = require('../types');

class AVClub extends Feed {
  constructor() {
    super('http://www.avclub.com/feeds/rss/', types.AVClub);
  }
}

module.exports = new AVClub();
