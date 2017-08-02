const data = require('./data');
const Feed = require('./data/sources/feed');
const db = require('./db');
const valueSeq = require('./utils/value-seq');

// Just test one of the sources first
const sources = valueSeq(data);

// Iterate over sources and checkFeeds for each
function checkAllFeeds(sources, db) {
  // Check only ATOM/RSS feeds for now
  const feeds = sources.filter(source => Feed.prototype.isPrototypeOf(source));
  feeds.forEach(source => {
    checkFeeds(source, db);
  });
};


function checkFeeds(source, db) {
  return db.connection.then(async conn => {
    try {
      const docs = await source.listing;
      return db.updateTable(conn, source.type, docs)
        .then(results => console.log(results, source.type));
    } catch(e) {
      throw e;
    }
  });
}

checkAllFeeds(sources, db);
