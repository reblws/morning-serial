#!/usr/bin/env node
const data = require('./data');
const Feed = require('./data/sources/feed');
const db = require('./db');
const { valueSeq } = require('./utils');

const sources = valueSeq(data);

function updateAllFeeds(sources, db) {
  sources.forEach(feed => updateFeed(feed, db));
}

function updateFeed(feed, db) {
  return db.connection.then(async conn => {
    try {
      const docs = await feed.listing;
      return db.updateTable(conn, feed.type, docs)
        .then(results => console.log(results.inserted, 'Inserted', feed.type));
    } catch(e) {
      throw e;
    }
  });
}

updateAllFeeds(sources, db);
