const http = require('http');
const express = require('express');
const { isProduction } = require('./utils');

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT, 10);

// Let nginx handle static files in prod
if (!isProduction) {
  app.use('/assets', express.static('dist/assets'));
}

require('./middleware')(app);
require('./routes')(app);
require('./sockets')(server);

server.listen(PORT);
console.log('Listening to ', PORT);

