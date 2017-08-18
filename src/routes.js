/* React */
const React = require('react');
const { renderToString } = require('react-dom/server');

/* Templating and Components */
const template = require('./view/template');
const App = require('./view').default;

/* Data & Database */
const { connection, readTables } = require('./db');
const data = require('./data');
const types = require('./data/types');
const { valueSeq, findSource } = require('./utils');

module.exports = (app) => {
  // Routes
  // Main route, serves up react
  app.get('/', async (request, response) => {
    // Grab any cookies containing the feed if they exist
    const {
      activeFeeds = '',
    } = request.cookies;
    const cookieFeeds = activeFeeds.split('+').filter(x => x);
    const defaultFeeds = valueSeq(types).filter(s =>
      s !== 'product-hunt' && s !== 'beta-list' && s !== 'digg'
    );
    const feeds = cookieFeeds.length > 0
      ? cookieFeeds
      : defaultFeeds;
    const availableSources = valueSeq(data).map(
      ({ name, faviconURL, host, type }) => ({ name, faviconURL, host, type }),
    );
    try {
      const conn = await connection;
      const latestArticles = await readTables(conn, 0, feeds);
      const initialState = {
        activeFeeds: feeds,
        latestArticles,
        availableSources,
      };
      const appString = renderToString(<App {...initialState} />);
      response.send(template({
        body: appString,
        title: 'Morning Serial - A Realtime News Aggregator',
        initialState: JSON.stringify(initialState),
      }));
    } catch (e) {
      throw e;
    }
  });


  app.get('/api/feeds', async (request, response) => {
    const {
      sources,
      page = 0,
      increment = 25,
      offset = 0,
    } = request.query;
    // parse the query
    // Going to assume they are the string values from ./data/types
    const feeds = sources.split('+');
    // 1 -> should query db index 0
    const pageInt = parseInt(page, 10);
    const incrementInt = parseInt(increment, 10);
    const offsetInt = parseInt(offset, 10) || 0;
    try {
      const conn = await connection;
      const latestArticles = await readTables(
        conn,
        pageInt,
        feeds,
        incrementInt,
        offsetInt,
      );
      response.json(latestArticles);
    } catch (e) {
      response.sendStatus(500);
      throw e;
    }
  });

  // Show the available sources
  app.get('/api/sources', (_, response) => {
    const sources = valueSeq(data);
    response.json(
      sources.map(({
        name,
        faviconURL,
        host,
        type,
      }) => ({
        name,
        faviconURL,
        host,
        type,
      })),
    );
  });

  // Show the sources listing, but as the records from the db
  app.get('/api/sources/:source', async (request, response) => {
    const {
      source,
      page = 0,
    } = request.params;
    try {
      const conn = await connection;
      const latestArticles = await readTables(conn, page, source);
      response.json(latestArticles);
    } catch (e) {
      response.sendStatus(400);
      throw e;
    }
  });

  // Just get the sources listing, rather than from the db, this is for debugging
  app.get('/api/sources/:source/listing', (request, response) => {
    const {
      source,
    } = request.params;
    findSource(data, source).listing
      .then(results => response.json(results))
      .catch(err => console.error(err));
  });
};
