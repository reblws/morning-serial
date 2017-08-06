const API = require('./api');
const types = require('../types');

class HackerNews extends API {
  constructor() {
    const baseURL = 'https://hacker-news.firebaseio.com/v0/';
    super(baseURL, types.HackerNews, 'https://news.ycombinator.com/');
    this.normalize = this.normalize.bind(this);
  }

  normalize(data) {
  // Need to time * 1000 for unix time conversion
    return data.map(({ title, url, time, id }) => (
      {
        title,
        link: url || `https://news.ycombinator.com/item?=${id}`,
        publishedAt: new Date(time * 1000),
        type: this.type,
      }
    ));
  }

  async getTopStories() {
    const topStoryIds = await this.fetch('/topstories.json');
    const top100 = topStoryIds.slice(0, 100).map(id => this.getItem(id));
    const topStories = await Promise.all(top100);
    return topStories;
  }

  getItem(id) {
    return this.fetch(`/item/${id}.json`)
      .catch(err => { throw err });;
  }

  get listing() {
    return this.getTopStories().then(this.normalize);
  }
}

module.exports = new HackerNews();
