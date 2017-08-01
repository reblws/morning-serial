const Feed = require('./feed');

class AVClub extends Feed {
  constructor() {
    super('http://www.avclub.com/feeds/rss/');
  }
}

module.exports = new AVClub();
