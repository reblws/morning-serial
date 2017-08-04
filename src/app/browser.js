// app/browser.js

const React = require('react');
const { render } = require('react-dom');
const App = require('./index');

render(<App />, document.getElementById('root'));
