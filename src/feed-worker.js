#!/usr/bin/env node
const data = require('./data');
const types = require('./data/types');
const db = require('./db');
const { valueSeq } = require('./utils');

const sources = valueSeq(data);
const sourceTypes = valueSeq(types);
function updateAllFeeds(conn) {
  return Promise.all(sources.map(feed => updateFeed(conn, feed)));
}

async function updateFeed(conn, feed) {
  try {
    const docs = await feed.listing;
    return db.updateTable(conn, feed.type, docs)
      .then(results => console.log(results.inserted, 'Inserted', feed.type));
  } catch(e) {
    throw e;
  }
}

// work
db.connection
  .then(db.setupAllTables)
  .then(db.createIndexes('publishedAt', ...sourceTypes))
  .then(conn => Promise.resolve(updateAllFeeds(conn)))
  .then(() => process.exit());
