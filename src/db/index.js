const r = require('rethinkdb');
const types = require('../data/types');
const config = require('./config');
const { toTableName, valueSeq } = require('../utils');

function logChanges(err, result) {
  if (err) throw err;
  console.log(JSON.stringify(result, null, 2));
}

// Main setup function
async function setupAllTables(conn) {
  const availableTables = await r.tableList().run(conn);
  const uncreatedTables = valueSeq(types).map(toTableName)
    .filter(table => !availableTables.includes(table));
  await Promise.all(uncreatedTables.map(table => setupTable(conn, table)));
  return conn;
}

// Tables need to have no dash
function setupTable(conn, table) {
  r.tableCreate(table, { primaryKey: 'uuid' }).run(conn);
  r.table(table).indexCreate('publishedAt').run(conn);
}

const tableIndexes = conn => async tableName => ({
  name: tableName,
  indexList: await r.table(tableName).indexList().run(conn),
});

// Create secondary indexes for each table that doesn't have one
function createIndexes(index, ...feeds) {
  // for filter
  return async conn => {
    const noIndex = ({ indexList }) => !indexList.includes(index);
    const toTableIndex = tableIndexes(conn);
    try {
      const tablesAndIndexes = await Promise.all(
        feeds.map(toTableName).map(toTableIndex),
      );
      const tablesWithNoIndex = await Promise.all(tablesAndIndexes.filter(noIndex));
      await Promise.all(tablesWithNoIndex.map(
        ({ name }) => r.table(name).indexCreate(index).run(conn),
      ));
      return conn;
    } catch (e) {
      throw new Error("Can't update table with new indexes");
    }
  };
}

// Create a union
async function readTables(conn, page, types, increment = 25, offset = 0) {
  const availableTables = await r.tableList().run(conn);
  const tableNames = types.map(toTableName)
    .filter(table => availableTables.includes(table));
  // Filter the tables we don't have
  // Paginate 50 articles a time
  const startIndex = (increment * page) + offset;
  const endIndex = startIndex + (increment + offset);
  return doTableUnion(tableNames)
    .slice(startIndex, endIndex)
    .run(conn);
}

// Perform a table union, with an optional callback performed on each table
function doTableUnion(
  tables,
  callback = table => table.orderBy(r.desc('publishedAt')),
  sortIndex = r.desc('publishedAt'),
) {
  const table = callback(r.table(tables[0]));
  const tablesLeft = tables.slice(1);
  const options = sortIndex
    ? { interleave: sortIndex }
    : {};
  return tablesLeft.length < 1
    ? table
    : table.union(doTableUnion(tablesLeft, callback, sortIndex), options);
}

async function updateTable(conn, feedType, documents) {
  // Check if the table exists
  const feedTable = toTableName(feedType);
  const uuids = await Promise.all(promiseUUIDs(conn, documents));
  const documentsToInsert = documents.map(mergeUUIDs(conn, uuids));
  return r.table(feedTable).insert(
    documentsToInsert,
    { conflict: 'update' },
  ).run(conn);
}

function mergeUUIDs(conn, uuids) {
  return (doc, index) => Object.assign({}, doc, { uuid: uuids[index] });
}

function promiseUUIDs(conn, documents) {
  return documents.map(({ type, link, date }) =>
    promiseUniqueIdentifier(conn, type, link, date));
}

// Write a function that gives me a global change feed
function globalChangesFeed(conn, callback, tableList) {
  const globalTableList = valueSeq(tableList).map(toTableName);
  const changeFeed = table => table.changes();
  return doTableUnion(globalTableList, changeFeed, null).run(conn, callback);
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
const connection = r.connect(config);

module.exports = {
  connection,
  setupAllTables,
  updateTable,
  readTables,
  createIndexes,
  globalChangesFeed,
};
