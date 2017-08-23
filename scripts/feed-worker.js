#!/usr/bin/env node
const data = require('../src/data');
const types = require('../src/data/types');
const db = require('../src/db');
const { valueSeq } = require('../src/utils');

const sources = valueSeq(data);
const sourceTypes = valueSeq(types);

function updateAllFeeds(conn) {
  console.log(Date.now());
  return Promise.all(sources.map(feed => updateFeed(conn, feed)));
}

async function updateFeed(conn, feed) {
  try {
    const docs = await feed.listing;
    return db.updateTable(conn, feed.type, docs)
      .then(results => {
        console.log(results.inserted, 'Inserted', feed.type);
      });
  } catch(e) {
    throw e;
  }
}

// work
db.connection
  .then(db.setupAllTables)
  .then(db.createIndexes('publishedAt', ...sourceTypes))
  .then(conn => Promise.resolve(updateAllFeeds(conn)))
  .then(conn => conn.close())
  .then(() => process.exit());
