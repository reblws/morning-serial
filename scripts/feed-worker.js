#!/usr/bin/env node
const data = require('../src/data');
const types = require('../src/data/types');
const db = require('../src/db');
const { valueSeq } = require('../src/utils');

const sources = valueSeq(data);
const sourceTypes = valueSeq(types);

function updateAllFeeds(conn) {
  console.log(Date.now());
  return Promise.all(
    sources.map(feed => updateFeed(conn, feed))
  )
    .then(x => {
      conn.close();
      return x;
    });
}

function updateFeed(conn, feed) {
  return feed.listing
    .then(docs => db.updateTable(conn, feed.type, docs))
    .catch(e => { throw e });
}

// work
db.connection
  .then(db.setupAllTables)
  .then(db.createIndexes('publishedAt', ...sourceTypes))
  .then(conn => Promise.resolve(updateAllFeeds(conn)))
  .then(console.log)
  .then(() => process.exit());
