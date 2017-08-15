const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction
  ? process.env.HOST
  : `localhost:${process.env.PORT}`;

module.exports = {
  isProduction,
  host,
};
