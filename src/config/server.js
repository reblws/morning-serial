const { host } = require('./');

module.exports = {
  port: parseInt(process.env.PORT, 10),
  host,
};
