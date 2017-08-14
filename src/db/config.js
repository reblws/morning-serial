const config = require('./');

module.exports = {
  host: 'localhost',
  db: process.env.NODE_ENV === 'production' ? 'serial' : 'test',
  port: process.env.RETHINKDB_PORT,
};
