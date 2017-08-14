/* Middleware Imports */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csp = require('helmet-csp');

module.exports = app => {
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
        'ws://serial.reblws.me',
        'https://api.coinmarketcap.com/',
      ],
    },
  });

  app.use(cookieParser());
  app.use(cspSettings);
  app.use(bodyParser.urlencoded({ extended: false }));
};
