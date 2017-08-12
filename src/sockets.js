const { connection, globalChangesFeed } = require('./db');
const types = require('./data/types');
const { valueSeq } = require('./utils');

module.exports = (server) => {
  const io = require('socket.io')(server);

  const handleNewArticle = (err, item) => {
    if (err) {
      throw new Error(`Got an error while listening for articles \n ${err}`);
    }
    const { type } = item.new_val;
    io.to(type).emit('new article', item.new_val);
  };

  const listenToFeed = (err, cursor) => {
    if (err) {
      throw new Error(`Got an error while listening for articles \n ${err}`);
    }
    cursor.each(handleNewArticle);
  };

  io.on('connection', socket => {
    socket.emit('greetings', 'welcome');
    socket.on('i want to join', rooms => {
      rooms.forEach(room => socket.join(room));
    });
    socket.on('i want to leave', socket.leave);
  });

  // Emit change
  connection.then(conn =>
    globalChangesFeed(conn, listenToFeed, valueSeq(types)),
  );
};
