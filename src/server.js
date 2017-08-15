const http = require('http');
const express = require('express');
const { isProduction } = require('./config');
const { port } = require('./config/server');

const app = express();
const server = http.createServer(app);

// Let nginx handle static files in prod
if (!isProduction) {
  app.use('/assets', express.static('dist/assets'));
}

require('./middleware')(app);
require('./routes')(app);
require('./sockets')(server);

server.listen(port);
console.log('Listening to ', port);

