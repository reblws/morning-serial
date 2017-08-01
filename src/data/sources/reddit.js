const API = require('./api');
const types = require('../types');

class Reddit extends API {
  constructor() {
    const baseURL = 'http://reddit.com/api/v1';
    super(baseURL, types.Reddit);
  }

  getHotListings() {
    return this.fetch('/hot');
  }

  get listing() {
    return this.getHotListings();
  }
}

module.exports = new Reddit();
