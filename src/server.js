const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const jsonfile = require('jsonfile');

const app = express();
const PORT = process.env.PORT || 9999;

const data = require('./data');
const types = require('./data/types');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (_, response) => response.redirect('/sources'));

app.post('/icons', (request, response) => {
  response.sendStatus(200);
})

app.get('/news/', (_, response) => {
  data.NewsAPI.getAllSources()
    .then(json => response.json(json.sources))
    .catch(err => { console.error(err) });
});

app.get('/news/:source', (request, response) => {
  const { source } = request.params;
  data.NewAPI.getArticlesFrom(source)
    .then(json => response.json(json))
    .catch(err => { console.error(err) });
});

app.get('/crypto', (_, response) => {
  data.CoinMarketCap.listing
    .then(json => response.json(json))
    .catch(err => response.sendStatus(500));
});

app.get('/hacker-news', (_, response) => {
  data.HackerNews.listing
    .then(json => {
      response.json(json);
    })
    .then(err => response.sendStatus(500));
});

app.get('/hacker-news/:item', (request, response) => {
  data.HackerNews.getItem(request.params.item)
    .then(json => {
      response.json(json);
    })
    .catch(err => { throw err });
});

app.get('/sidebar', (_, response) => {
  data.Sidebar.listing
    .then(json => response.json(json))
    .catch(err => { throw err });
});

app.get('/reddit', (_, response) => {
  data.Reddit.listing
    .then(json => response.json(json))
    .catch(err => { throw err });
});

app.get('/product-hunt', (_, response) => {
  data.ProductHunt.listing
    .then(json => response.json(json));
});

app.get('/indiehackers', (_, response) => {
  data.IndieHackers.listing.then(json => response.json(json)).catch(err => { throw err });
});

app.get('/designer-news', (_, response) => {
  data.DesignerNews.listing.then(json => response.json(json)).catch(err => { throw err });
});

app.get('/beta-list', (_, response) => {
  data.BetaList.listing.then(json => response.json(json)).catch(err => { throw err });
});

app.get('/the-outline', (_, response) => {
  data.TheOutline.listing.then(json => response.json(json))
    .catch(err => { throw err });
});

app.get('/av-club', (_, response) => {
  data.AVClub.listing.then(json => response.json(json)).catch(err => { throw err });
})

app.get('/538', (_, response) => {
  data.FiveThirtyEight.listing.then(json => response.json(json));
});

app.get('/mac-rumors', (_, response) => {
  data.MacRumors.listing.then(json => response.json(json));
})

app.listen(PORT);
console.log('Listening to ', PORT);


