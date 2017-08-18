// src/template.js

module.exports = function html({ body, title, initialState, version = 0 }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/assets/bundle.css?v=${version}" />
      </head>

      <body>
        <div id="root">${body}</div>
        <script src="/assets/bundle.js?v=${version}"></script>
      </body>

    </html>
  `;
};

