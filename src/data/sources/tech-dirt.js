const Feed = require('./feed');
const types = require('../types');

const TechDirt = new Feed('https://www.techdirt.com/techdirt_rss.xml', types.TechDirt);

module.exports = TechDirt;
