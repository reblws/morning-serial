module.exports = {
  NewsAPI: require('./sources/news-api'),
  CoinMarketCap: require('./sources/coin-market-cap'),
  HackerNews: require('./sources/hacker-news'),
  Sidebar: require('./sources/sidebar'),
  Reddit: require('./sources/reddit'),
  ProductHunt: require('./sources/product-hunt'),
  IndieHackers: require('./sources/indie-hackers'),
  DesignerNews: require('./sources/designer-news'),
  BetaList: require('./sources/beta-list'),
  TheOutline: require('./sources/the-outline'),
  AVClub: require('./sources/av-club'),
  MacRumors: require('./sources/mac-rumors'),
  FiveThirtyEight: require('./sources/538'),
};

/*
Refactor feeds to use pubsubhhubbub

Things that should be feeds:
hackernews
sidebar

DONE:
producthunt: https://www.producthunt.com/
SCRAP - indiehackers: https://www.indiehackers.com/
designernews: https://www.designernews.co/?format=rss
betalist: https://betalist.com/
theoutline: https://theoutline.com/feeds/recent.rss
avclub: http://www.avclub.com/rss/
fivethirtyeight: https://fivethirtyeight.com/features/feed/

TODOS:
macrumors: https://www.macrumors.com/

*/
