const r = require('rethinkdb');
const data = require('../data');

function logChanges(err, result) {
  if (err) throw err;
  console.log(JSON.stringify(result, null, 2));
}


// Open the connection
r.connect({ host: 'localhost', port: 28015 })
  .then(conn => {
    // r.db('test').tableCreate('articles').run(conn, logChanges)
    r.db('test').table('articles').indexCreate('type').run(conn, logChanges);
  })
  /* Basic insert */
  // .then(async conn => {
  //   const table = r.db('test').table('articles');
  //   const feed = await data.DesignerNews.listing;
  //   // Strip the feed of everything that's already in there
  //   const filteredFeed = feed.
  //   table.insert(feed).run(conn, logChanges);
  // });


  .then(async conn => {
    const table = r.db('test').table('articles');
    const feed = await data.DesignerNews.listing;
  })


/**
 * Returns a function that creates a unique identifier for a given set of keys.
 *
 * @param {any} r - The rethinkDB object
 * @param {any} connection - Instance of connection to rethinkdb
 * @returns {Function}
 */
function promiseUniqueIdentifier(r, connection) {
  const compositeString = type + link + Date.parse(date);
  return (type, link, date) => r.uuid(compositeString).run(connection);
}

module.exports = r;
