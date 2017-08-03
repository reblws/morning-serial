const r = require('rethinkdb');
const data = require('../data');
const config = require('./config');
const { toTableName } = require('../utils');

function logChanges(err, result) {
  if (err) throw err;
  console.log(JSON.stringify(result, null, 2));
}

const connection = r.connect(config);

// Tables need to have no dash
function setupTable(conn, table) {
  return r.tableCreate(table, { primaryKey: 'uuid' })
    .indexCreate('publishedAt')
    .run(conn);
}

// Create a union
function readTables(conn, ...types) {
  const tableNames = types.map(toTableName);
  return doTableUnion(...tableNames).limit(50).run(conn);
}

function doTableUnion(...tables) {
  const table = r.table(tables[0]).orderBy(r.desc('publishedAt'));
  const tablesLeft = tables.slice(1);
  return tablesLeft.length < 1
    ? table
    : table.union(doTableUnion(...tablesLeft), { interleave: r.desc('publishedAt') });
}

async function updateTable(conn, feedType, documents) {
  // Check if the table exists
  const feedTable = toTableName(feedType);
  const availableTables = await r.tableList().run(conn);

  // If table doesn't exist yet, create it based on the type of the
  // Feed object
  if (!availableTables.includes(feedTable)) {
    await setupTable(conn, feedTable).then(results => console.log(results));
  }
  const uuids = await Promise.all(promiseUUIDs(conn, documents));
  const documentsToInsert = documents.map(mergeUUIDs(conn, uuids));
  return r.table(feedTable).insert(documentsToInsert).run(conn);
}

function mergeUUIDs(conn, uuids) {
  return (doc, index) => Object.assign(doc, { uuid: uuids[index]});
}

function promiseUUIDs(conn, documents) {
  return documents.map(({ type, link, date }) => {
    return promiseUniqueIdentifier(conn, type, link, date);
  });
}

/**
 * Returns a function that creates a unique identifier for a given set of keys.
 *
 * @param {any} r - The rethinkDB object
 * @param {any} connection - Instance of connection to rethinkdb
 * @returns {Function}
 */
function promiseUniqueIdentifier(conn, type, link, date) {
  const compositeString = type + link + Date.parse(date);
  return r.uuid(compositeString).run(conn);
}

// connection.then(conn => readTables(conn, 'designernews'));

module.exports = {
  connection,
  setupTable,
  updateTable,
  readTables,
};
