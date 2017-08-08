const Feed = require('./feed');
const types = require('../types');

const Slashdot = new Feed('http://rss.slashdot.org/Slashdot/slashdotMain', types.Slashdot, 'http://slashdot.org');

module.exports = Slashdot;
