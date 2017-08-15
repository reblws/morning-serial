/* Middleware Imports */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csp = require('helmet-csp');
const { host } = require('./config/server');
const { isProduction } = require('./config');

module.exports = app => {
  // Only allow https in prod
  const webSocketsHost = isProduction
    ? `wss://${host}`
    : `ws://${host}`;
  // Middleware
  const cspSettings = csp({
    directives: {
      defaultSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
      ],
      imgSrc: [
        '*',
      ],
      styleSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
        "'unsafe-inline'",
      ],
      connectSrc: [
        "'self'",
        host,
        webSocketsHost,
        'https://api.coinmarketcap.com/',
      ],
    },
  });

  app.use(cookieParser());
  app.use(cspSettings);
  app.use(bodyParser.urlencoded({ extended: false }));
};
