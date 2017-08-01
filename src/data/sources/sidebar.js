const API = require('./api');

class Sidebar extends API {
  constructor() {
    const baseURL = 'https://sidebar.io/';
    super(baseURL);
  }

  getListing() {
    return this.fetch('/api');
  }

  get listing() {
    return this.getListing();
  }
}

module.exports = new Sidebar();
