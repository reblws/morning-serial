const { isProduction } = require('./');

const db = isProduction ? 'serial' : 'test';

module.exports = {
  host: process.env.DATABASE_HOST,
  port: process.env.RETHINKDB_PORT,
  db,
};
