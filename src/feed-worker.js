#!/usr/bin/env node
const data = require('./data');
const Feed = require('./data/sources/feed');
const db = require('./db');
const { valueSeq } = require('./utils');

const sources = valueSeq(data);

function updateAllFeeds(conn, sources) {
  sources.forEach(feed => updateFeed(conn, feed));
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

db.connection
  .then(conn => db.setupAllTables(conn))
  .then(conn => updateAllFeeds(conn, sources));
