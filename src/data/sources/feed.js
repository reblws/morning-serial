const FeedParser = require('feedparser-promised');
const { toHumanName, hostName, findFavicon } = require('../../utils');
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
   * @param {string} baseHost - In case the feed differes
   * @memberof Feed
   */
  constructor(uri, type, baseHost) {
    const host = baseHost || hostName(uri);
    this.options = {
      uri,
      timeout: 3000,
    }
    this.host = host;
    this.name = toHumanName(type);
    this.type = type;
    this.faviconURL = findFavicon(host);
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
      publishedAt: new Date(date),
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
    return this.parseFeed()
      .then(data => this.normalize(data))
      .catch(e => {
        console.error(e);
        throw new Error(`Failed to fetch ${this.type} feed!`)
      });
  }
}

module.exports = Feed;
