/* Server & React */
const http = require('http');
const express = require('express');
const sockets = require('./sockets');
// Server Stuff
const app = express();
const PORT = process.env.PORT || 9999;
const server = http.createServer(app);

require('./middleware')(app);
require('./routes')(app);
require('./sockets')(server);

app.use('/assets', express.static('dist/assets'));

server.listen(PORT);
console.log('Listening to ', PORT);

