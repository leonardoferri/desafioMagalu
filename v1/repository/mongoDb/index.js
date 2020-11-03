'use strict';

const factory = require('./factory');
const mongo = require('../../../commons/mongoDb');
const config = require('../../../config');

const collectionFactory = factory({
  db: mongo,
  collectionName: {
    collectionDefault: config.mongo.collections.collectionDefault,
  },
  configConnection: {
    dbUrl: config.mongo.uri,
    dbName: config.mongo.base,
  },
});

module.exports = {
  collectionFactory,
};
