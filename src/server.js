const express = require('express');
const bodyParser = require('body-parser');
const csp = require('helmet-csp');
const React = require('react') ;
const { renderToString } = require('react-dom/server');

const template = require('./template')
const App = require('./app').default;
const { connection, readTables } = require('./db');
const data = require('./data');
const { valueSeq } = require('./utils');

const server = express();
const PORT = process.env.PORT || 9999;

// Middleware
const cspSettings = csp({
  directives: {
    defaultSrc: [
      "'self'",
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
    ],
  },
  setAllHeaders: true,
});

server.use(cspSettings);
server.use('/assets', express.static('dist/assets'));
server.use(bodyParser.urlencoded({ extended: false }));

async function getLatestArticles(conn, feeds) {
  try {
    const conn = await connection;
    const latestArticles = await readTables(conn, ...feeds);
    return latestArticles;
  } catch(e) {
    throw e;
  }
}

// Routes
server.get('/', cspSettings, (_, response) => {
  const initialState = {
    fetched: true,
  };
  const appString = renderToString(<App fetched={initialState.fetched} />);
  response.send(template({
    body: appString,
    title: 'Hello World',
    initialState: JSON.stringify(initialState),
  }));
});


server.get('/api/feeds', async (request, response) => {
  const { sources } = request.query;
  // parse the query
  // Going to assume they are the string values from ./data/types
  const feeds = sources.split(/\s/);
  try {
    const conn = await connection;
    const latestArticles = await getLatestArticles(conn, ...feeds);
    response.json(latestArticles);
  } catch(e) {
    response.sendStatus(500);
    throw e;
  }
});

// Show the available sources
server.get('/api/sources', (_, response) => {
  const sources = valueSeq(data);
  response.json(
    sources.map(({ name, faviconURL, host }) => ({ name, faviconURL, host })),
  );
});

server.listen(PORT);
console.log('Listening to ', PORT);


