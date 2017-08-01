const FeedParser = require('feedparser-promised');

class Feed {
  constructor(uri) {
    const options = {
      uri,
      timeout: 3000,
    }
    this.parseFeed = FeedParser.parse(options);
  }

  get listing() {
    return this.parseFeed;
  }
}

module.exports = Feed;
