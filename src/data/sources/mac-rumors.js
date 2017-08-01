const Feed = require('./feed');

class MacRumors extends Feed {
  constructor() {
    super('http://feeds.macrumors.com/MacRumors-All');
  }
}

module.exports = new MacRumors();
