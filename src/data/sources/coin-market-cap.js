const API = require('./api');
const types = require('../types');

class CoinMarketCap extends API {
  constructor() {
    const baseURL = 'https://api.coinmarketcap.com/v1/'
    super(baseURL, types.CoinMarketCap);
  }

  getLatestTicker(limit = 5) {
    return this.fetch('ticker', { params: { limit } });
  }

  get listing() {
    return this.getLatestTicker();
  }
}

module.exports = new CoinMarketCap();
