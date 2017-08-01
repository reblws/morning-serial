const API = require('./api');

class NewsAPI extends API {
  constructor() {
    const baseURL = 'https://newsapi.org/v1/';
    const API_KEY = process.env.NEWS_API_KEY;
    super(baseURL, API_KEY);
  }

  getAllSources() {
    const params = {
      language: 'en',
    }
    return this.fetch('/sources', { params });
  }

  getArticlesFrom(source) {
    const params = {
      source,
    }
    return this.fetch('/articles', { params });
  }

  listing(source) {
    return this.getArticlesFrom(source);
  }
}


module.exports = new NewsAPI();
