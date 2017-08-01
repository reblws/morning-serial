const Feed = require('./feed');
const types = require('../types');

class DesignerNews extends Feed {
  constructor() {
    super('https://www.designernews.co/?format=rss', types.DesignerNews);
  }
}

module.exports = new DesignerNews();
