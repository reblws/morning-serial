const FeedParser = require('feedparser-promised');

/**
 * An RSS or ATOM feed.
 *
 * @class Feed
 */
class Feed {
  /**
   * Creates an instance of Feed.
   * @param {string} uri - Link to the site's RSS feed.
   * @param {string} type - Dashed name of the site the feed came from.
   * @memberof Feed
   */
  constructor(uri, type) {
    this.options = {
      uri,
      timeout: 3000,
    }
    this.type = type;
  }

  /**
   * Returns the results of a feed given in options
   *
   * @returns {Promise}
   * @memberof Feed
   */
  parseFeed() {
    return FeedParser.parse(this.options);
  }

  /**
   * Normalizes the entry data for the feed
   *
   * @param {Array} data - Items from the fetched rss
   * @returns {Array} Normalized items
   * @memberof Feed
   */
  normalize(data) {
    const toSchema = ({ title, date, link }) => ({
      title,
      publishedAt: date,
      link,
      type: this.type,
    });
    return data.map(toSchema);
  }

  /**
   * Returns normalized, JSON-formatted representation of the feed.
   *
   * @readonly
   * @memberof Feed
   */
  get listing() {
    return this.parseFeed().then(data => this.normalize(data));
  }
}

module.exports = Feed;
