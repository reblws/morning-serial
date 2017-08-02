const r = require('rethinkdb');
const data = require('../data');
const config = require('./config');
const { formatType } = require('../utils');

function logChanges(err, result) {
  if (err) throw err;
  console.log(JSON.stringify(result, null, 2));
}

const connection = r.connect(config);

// Tables need to have no dash
function setupTable(conn, table) {
  return r.tableCreate(table, { primaryKey: 'uuid' }).run(conn);
}

async function updateTable(conn, feedType, documents) {
  // Check if the table exists
  const feedTable = formatType(feedType);
  const availableTables = await r.tableList().run(conn);
  if (!availableTables.includes(feedTable)) {
    setupTable(conn, feedTable).then(results => console.log(results));
  }
  const uuids = await Promise.all(promiseUUIDs(documents, conn));
  const documentsToInsert = documents.map(mergeUUIDs(uuids, conn));
  return r.table(feedTable).insert(documentsToInsert).run(conn);
}

function mergeUUIDs(uuids, conn) {
  return (doc, index) => Object.assign(doc, { uuid: uuids[index]});
}

function promiseUUIDs(documents, conn) {
  return documents.map(({ type, link, date }) => {
    return promiseUniqueIdentifier(type, link, date, conn);
  });
}

// Map function for adding uuids to documents before table
// insert
/* This is problematic. It's not good to combine map functions
  with async methods
*/
// async function uuids(conn) {
//   return async function addUUID(doc) {
//     const { type, link, date } = doc;
//     const uuid = await promiseUniqueIdentifier(type, link, date, conn);
//     return Object.assign({}, doc, { uuid });
//   }
// }

/**
 * Returns a function that creates a unique identifier for a given set of keys.
 *
 * @param {any} r - The rethinkDB object
 * @param {any} connection - Instance of connection to rethinkdb
 * @returns {Function}
 */
function promiseUniqueIdentifier(type, link, date, conn) {
  const compositeString = type + link + Date.parse(date);
  return r.uuid(compositeString).run(conn);
}

module.exports = {
  connection,
  setupTable,
  updateTable,
};
