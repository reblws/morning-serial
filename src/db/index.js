const r = require('rethinkdb');

// Open the connection
r.connect({ host: 'localhost', port: 28015 })
  .then(conn => {
    r.db('test').tableCreate('authors').run(conn, (err, result) => {
      if (err) throw err;
      console.log(JSON.stringify(result, null, 2));
    });
  });

module.exports = r;
