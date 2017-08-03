const express = require('express');
const bodyParser = require('body-parser');
// const axios = require('axios');
// const jsonfile = require('jsonfile');
const { connection, readTables } = require('./db');
const data = require('./data');
const { valueSeq } = require('./utils');
const app = express();
const PORT = process.env.PORT || 9999;


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/api/feeds', async (request, response) => {
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
app.get('/api/sources', (_, response) => {
  const sources = valueSeq(data);
  response.json(
    sources.map(({ name, faviconURL, host }) => ({ name, faviconURL, host })),
  );
});

app.listen(PORT);
console.log('Listening to ', PORT);


