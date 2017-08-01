const Feed = require('./feed');
const types = require('../types');

class MacRumors extends Feed {
  constructor() {
    super('http://feeds.macrumors.com/MacRumors-All', 'mac-rumors', types.MacRumors);
  }
}

module.exports = new MacRumors();
