const API = require('./api');
const types = require('../types');

class Sidebar extends API {
  constructor() {
    const baseURL = 'https://sidebar.io/';
    super(baseURL, types.Sidebar);
  }

  getListing() {
    return this.fetch('/api');
  }

  get listing() {
    return this.getListing();
  }
}

module.exports = new Sidebar();
