const Feed = require('./feed');

class TheOutline extends Feed {
  constructor() {
    super('https://theoutline.com/feeds/recent.rss');
  }
}

module.exports = new TheOutline();
