const Feed = require('./feed');

class ProductHunt extends Feed {
  constructor() {
    super('https://www.producthunt.com/feed');
  }
}

module.exports = new ProductHunt();
