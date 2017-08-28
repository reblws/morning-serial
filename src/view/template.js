// src/template.js
const React = require('react');
const { template } = require('rapscallion');
const App = require('./index').default;


module.exports = function html({ title, initialState, version = 0 }) {
  const stringVersion = String(version);
  return template`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
        <title>${title}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
        <link rel="manifest" href="/assets/manifest.json">
        <link rel="mask-icon" href="/assets/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="theme-color" content="#FAF9F0">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/assets/bundle.css?v=${stringVersion}" />
      </head>

      <body>
        <div id="root">${<App {...initialState} />}</div>
        <script src="/assets/bundle.js?v=${stringVersion}"></script>
      </body>

    </html>
  `;
};

