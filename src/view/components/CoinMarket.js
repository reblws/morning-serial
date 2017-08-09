import React from 'react';
import axios from 'axios';

export default class CoinMarket extends React.Component {
  static fetch(limit = 5, currency = 'USD') {
    const convert = currency === 'USD' ? '' : `&convert=${currency}`;
    return axios.get(`
      https://api.coinmarketcap.com/v1/ticker/?limit=${limit}${convert}
    `)
      .then(results => results.data);
  }

  constructor() {
    super();
    this.state = {
      ticker: [],
    };
  }

  componentDidMount() {
    CoinMarket.fetch().then(ticker => this.setState({ ticker }));
  }

  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}
// Example API entry
// "id": "bitcoin",
// "name": "Bitcoin",
// "symbol": "BTC",
// "rank": "1",
// "price_usd": "573.137",
// "price_btc": "1.0",
// "24h_volume_usd": "72855700.0",
// "market_cap_usd": "9080883500.0",
// "available_supply": "15844176.0",
// "total_supply": "15844176.0",
// "percent_change_1h": "0.04",
// "percent_change_24h": "-0.3",
// "percent_change_7d": "-0.57",
// "last_updated": "1472762067"
