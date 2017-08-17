const Feed = require('./feed');
const types = require('../types');

const ArsTechnica = new Feed('http://feeds.arstechnica.com/arstechnica/index/', types.ArsTechnica, 'https://arstechnica.com/');

module.exports = ArsTechnica;
