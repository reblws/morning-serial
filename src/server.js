const express = require('express');
const bodyParser = require('body-parser');
// const axios = require('axios');
// const jsonfile = require('jsonfile');
const { connection, readTables } = require('./db');

const app = express();
const PORT = process.env.PORT || 9999;

const data = require('./data');
const types = require('./data/types');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/feeds', async (request, response) => {
  const { sources } = request.query;
  // parse the query
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

app.listen(PORT);
console.log('Listening to ', PORT);


