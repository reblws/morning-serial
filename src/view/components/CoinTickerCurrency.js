import React from 'react';
import PropTypes from 'prop-types';
import CryptoCoin from 'react-cryptocoins';
import { format } from 'currency-formatter';

CoinTickerCurrency.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  percentChange24h: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  marketCap: PropTypes.string.isRequired,
};

export default function CoinTickerCurrency({
  name,
  rank,
  price,
  percentChange24h,
  symbol,
  marketCap,
}) {
  const percentChange = parseInt(percentChange24h, 10);
  const percentChangeModifierClassName = percentChange > 0
    ? 'currency-info__change--positive'
    : 'currency-info__change--negative';
  const marketCapDisplay = format(parseFloat(marketCap), {
    code: 'USD',
    precision: 0,
  });
  const priceDisplay = format(parseFloat(price), { code: 'USD' });
  const svgPath = `/assets/svg/${symbol}.svg`;
  const linkName = name.split(/\s/g).join('-').toLowerCase();
  return (
    <a
      href={`
        https://coinmarketcap.com/currencies/${linkName}/
      `}
      className="currency-link"
    >
      <div className="ticker-currency">
        <img
          className={`ticker-currency__icon ${symbol}`}
          src={svgPath}
          alt={name}
          title={name}
          type="image/svg+xml"
        />
        <div className="currency-info">
          <div className="currency-info__price">
            <strong>{marketCapDisplay}</strong><br />
            {priceDisplay}/{symbol}
          </div>
          <div className={`currency-info__change ${percentChangeModifierClassName}`}>
            {percentChange24h}
          </div>
        </div>
      </div>
    </a>
  );
}
