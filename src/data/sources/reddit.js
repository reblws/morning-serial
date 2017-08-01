const API = require('./api');

class Reddit extends API {
  constructor() {
    const baseURL = 'http://reddit.com/api/v1';
    super(baseURL);
  }

  getHotListings() {
    return this.fetch('/hot');
  }

  get listing() {
    return this.getHotListings();
  }
}

module.exports = new Reddit();
