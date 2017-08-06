const API = require('./api');
const types = require('../types');
const queryString = require('query-string');
const { valueSeq } = require('../../utils');

class Sidebar extends API {
  constructor() {
    const baseURL = 'https://sidebar.io/';
    super(baseURL, types.Sidebar);
    this.normalize = this.normalize.bind(this);
  }

  normalize(data) {
    return data.map(({ headline, url, date }) => (
      {
        title: headline,
        publishedAt: date,
        link: valueSeq(queryString.parse(url))[0],
        type: this.type,
      }
    ));
  }

  getListing() {
    return this.fetch('/api');
  }

  get listing() {
    return this.getListing()
      .then(this.normalize)
      .catch(e => { throw new Error(e) });
  }
}

module.exports = new Sidebar();
