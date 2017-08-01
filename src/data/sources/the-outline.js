const Feed = require('./feed');
const types = require('../types');

class TheOutline extends Feed {
  constructor() {
    super('https://theoutline.com/feeds/recent.rss', types.TheOutline);
  }
}

module.exports = new TheOutline();
