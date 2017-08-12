// const io = require('socket.io')();
const { connection, globalChangesFeed } = require('./db');
const types = require('./data/types');
const { valueSeq } = require('./utils');
// Get array of all tablenames

// Create a global union

function handleNewArticle(err, item) {
  if (err) {
    throw new Error(`Got an error ${err} while listening for articles`);
  }
  /* Example new articles */

  // { new_val:
  //   { link: 'http://www.avclub.com/article/suspended-fox-news-host-sues-reporter-over-dick-pi-259386?utm_medium=RSS&utm_campaign=feeds',
  //     publishedAt: 2017-08-12T03:24:00.000Z,
  //     title: 'Newswire: Suspended Fox News host sues reporter over dick pic allegations',
  //     type: 'av-club',
  //     uuid: '8dbc2d96-4ea6-5fd6-954a-6687c1e7bbe4' },
  //  old_val: null }

  // Emit `item` over socket io


}

connection.then(conn => {
  const listener = (err, item) => { console.log(item); };
  return globalChangesFeed(
    conn,
    (err, cursor) => {
      if (err) {
        console.log('Oops im an error');
      }
      console.log('LISTENING FOR NEW ARTICLES....');
      cursor.each(console.log);
    },
    valueSeq(types),
  );
});
