const Feed = require('./feed');
const types = require('../types');

class ProductHunt extends Feed {
  constructor() {
    super('https://www.producthunt.com/feed', types.ProductHunt);
  }
}

module.exports = new ProductHunt();
