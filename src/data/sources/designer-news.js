const Feed = require('./feed');
const types = require('../types');

const DesignerNews = new Feed('https://www.designernews.co/?format=rss', types.DesignerNews);

module.exports = DesignerNews;
