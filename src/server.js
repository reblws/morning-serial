const express = require('express');
const bodyParser = require('body-parser');
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
server.use('/assets', express.static('assets'));
server.use(bodyParser.urlencoded({ extended: false }));

// Routes
server.get('/', (_, response) => {
  const isMobile = 'hi';
  const appString = renderToString(<App isMobile={isMobile} />);
  response.send(template({
    body: appString,
    title: 'Hello World',
  }));
});


server.get('/api/feeds', async (request, response) => {
  const { sources } = request.query;
  // parse the query
  // Going to assume they are the string values from ./data/types
  const feeds = sources.split(/\s/);
  try {
    const conn = await connection;
    const latestArticles = await readTables(conn, ...feeds);
    response.json(latestArticles);
  } catch (e) {
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


