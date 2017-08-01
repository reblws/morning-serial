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

  /* conditional insert
    Once we figure this out,
  */
  .then(async conn => {
    const table = r.db('test').table('articles');
    const feed = await data.DesignerNews.listing;
    table.insert(feed).do(
      (doc) => {

      }
    )
  })

r.table('players').insert(newData).do(
    function (doc) {
        return r.branch(doc('inserted').ne(0),
            r.table('log').insert({time: r.now(), response: doc, result: 'ok'}),
            r.table('log').insert({time: r.now(), response: doc, result: 'error'}))
    }
).run(conn, callback);
module.exports = r;
