const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;

// Open the MongoDB connection once and cache the database handle.
const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db();
      console.log('Database connected.');
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

// Return the cached database handle (throws if initDb hasn't run yet).
const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = { initDb, getDatabase };
