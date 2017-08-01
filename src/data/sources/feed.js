const FeedParser = require('feedparser-promised');

class Feed {
  static normalize(data, schema) {
    const toSchema = ({title, date, link})  => ({
      title,
      publishedAt: date,
      link,
    });
    return data.map(toSchema);
  }

  constructor(uri) {
    const options = {
      uri,
      timeout: 3000,
    }
    this.parseFeed = FeedParser.parse(options);
  }

  get listing() {
    return this.parseFeed.then(data => Feed.normalize(data));
  }
}

module.exports = Feed;
