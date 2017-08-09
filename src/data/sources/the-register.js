const Feed = require('./feed');
const types = require('../types');

const TheRegister = new Feed('https://www.theregister.co.uk/headlines.atom', types.TheRegister);

module.exports = TheRegister;
