// src/template.js

module.exports = function html({ body, title, initialState }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/assets/bundle.css" />
      </head>

      <body>
        <div id="root">${body}</div>
        <script src="/assets/bundle.js"></script>
      </body>

    </html>
  `;
};

