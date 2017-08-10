import React from 'react';
import PropTypes from 'prop-types';
import CryptoCoin from 'react-cryptocoins';
import { format } from 'currency-formatter';

CoinTickerCurrency.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  percentChange24h: PropTypes.string.isRequired,
};

export default function CoinTickerCurrency({
  name,
  rank,
  price,
  percentChange24h,
  symbol,
  marketCap,
}) {
  const titleCaseSymbol = (s, index) => index !== 0 ? s.toLowerCase() : s;
  const coinComponentName = symbol.split().map(titleCaseSymbol).join('');
  const percentChange = parseInt(percentChange24h, 10);
  const percentChangeModifierClassName = percentChange > 0
    ? 'currency-info__change--positive'
    : 'currency-info__change--negative';
  const valueDisplay = format(
    parseFloat(price),
    { code: 'USD' },
  );
  return (
    <div className="ticker-currency">
      <div className="ticker-currency__ranking">
        {rank}
      </div>
      <div className="currency-info">
        <div className="currency-info__price">
          <strong>{valueDisplay}</strong>
        </div>
        <div className={`currency-info__change ${percentChangeModifierClassName}`}>
          {percentChange24h}
        </div>
        <div className="currency-info__symbol">
          ({symbol})
        </div>
      </div>
    </div>
  );
}
