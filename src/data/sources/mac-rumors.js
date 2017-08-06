const Feed = require('./feed');
const types = require('../types');

const MacRumors = new Feed('http://feeds.macrumors.com/MacRumors-All', types.MacRumors, 'http://macrumors.com');

module.exports = MacRumors;
