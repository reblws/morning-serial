const http = require('http');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 9999;
const server = http.createServer(app);

app.use('/assets', express.static('dist/assets'));

require('./middleware')(app);
require('./routes')(app);
require('./sockets')(server);


server.listen(PORT);
console.log('Listening to ', PORT);

