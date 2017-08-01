const FeedParser = require('feedparser-promised');

class Feed {

  constructor(uri, type) {
    const options = {
      uri,
      timeout: 3000,
    }
    this.parseFeed = FeedParser.parse(options);
    this.type = type;
  }

  normalize(data) {
    const toSchema = ({ title, date, link }) => ({
      title,
      publishedAt: date,
      link,
      type: this.type,
    });
    return data.map(toSchema);
  }

  get listing() {
    return this.parseFeed.then(data => this.normalize(data));
  }
}

module.exports = Feed;
