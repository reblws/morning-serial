const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? process.env.HOST : 'localhost';
module.exports = {
  isProduction,
  host,
};
