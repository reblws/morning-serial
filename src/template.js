// src/template.js

module.exports = function html({ body, title }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <title>${title}</title>
        <link rel="stylesheet" href="/assets/index.css" />
        <meta http-equiv="Content-Security Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'">
      </head>

      <body>
        <div id="root">${body}</div>
      </body>

      <script src="/assets/bundle.js"></script>
    </html>
  `;
};

