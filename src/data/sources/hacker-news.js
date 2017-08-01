const API = require('./api');

class HackerNews extends API {
  constructor() {
    const baseURL = 'https://hacker-news.firebaseio.com/v0/';
    super(baseURL);
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
    return this.getTopStories();
  }
}

module.exports = new HackerNews();
