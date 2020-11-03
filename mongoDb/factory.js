'use strict';

const { MongoClient } = require('mongodb');
const bluebird = require('bluebird');

const factory = (state, mongoClient = MongoClient, promise = bluebird) => ({
  connect(url, dbName) {
    return MongoClient.connect(url, {
      promiseLibrary: Promise,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
    }).then((client) => {
      state.db = client.db(dbName);
      return state.db;
    });
  },

  isConnected() {
    return state.db && state.db.serverConfig && state.db.serverConfig.isConnected();
  },

  disconnect() {
    state.db.serverConfig.close();
    state.db = null;
    return state.db;
  },

  collection(collectionName, configConnection) {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if ((!state.db || !state.db.serverConfig.isConnected()) && configConnection) {
        // eslint-disable-next-line consistent-return
        (async () => {
          const mongoConnect = mongoClient.connect(configConnection.dbUrl, {
            promiseLibrary: promise,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useNewUrlParser: true,
          }).then((client) => {
            state.db = client.db(configConnection.dbName);
            return resolve(state.db.collection(collectionName));
          });
          if (!mongoConnect) {
            return reject('Mongo failed to connect');
          }
          console.log('Conexão realizada com o MongoDb');
        })();
      } else {
        if (state.db) return resolve(state.db.collection(collectionName));
        return reject('There is no connection to the database.');
      }
    });
  },

  db() {
    return state.db;
  },
});

module.exports = factory;
