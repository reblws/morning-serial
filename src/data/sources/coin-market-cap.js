const API = require('./api');

class CoinMarketCap extends API {
  constructor() {
    const baseURL = 'https://api.coinmarketcap.com/v1/'
    super(baseURL);
  }

  getLatestTicker(limit = 5) {
    return this.fetch('ticker', { params: { limit } });
  }

  get listing() {
    return this.getLatestTicker();
  }
}

module.exports = new CoinMarketCap();
