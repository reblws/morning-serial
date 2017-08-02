const Feed = require('./feed');
const types = require('../types');

const ProductHunt = new Feed('https://www.producthunt.com/feed', types.ProductHunt);

module.exports = ProductHunt;
