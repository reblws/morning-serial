const Feed = require('./feed');
const types = require('../types');

// All their articles are published at the same time so they'd apprear
// grouped together
// Probably shouldn't use this

class IndieHackers extends Feed {
  constructor() {
    super('https://www.indiehackers.com/feed.xml');
  }
}

module.exports = new IndieHackers();
