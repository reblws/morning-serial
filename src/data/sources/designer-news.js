const Feed = require('./feed');

class DesignerNews extends Feed {
  constructor() {
    super('https://www.designernews.co/?format=rss');
  }
}

module.exports = new DesignerNews();
