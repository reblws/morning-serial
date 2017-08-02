const Feed = require('./feed');
const types = require('../types');

const MacRumors = new Feed('http://feeds.macrumors.com/MacRumors-All', 'mac-rumors', types.MacRumors);

module.exports = MacRumors;
