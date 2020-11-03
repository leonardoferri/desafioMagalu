'use strict';

const UUID = require('uuid');


module.exports = ({ db, collectionName, configConnection }) => ({
  insert: (message, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.insertOne(Object.assign({ _id: UUID('v4') }, message))
      .then(result => result.ops[0])),
  insertMany: (objList, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.insertMany(objList)
      .then(result => result.ops[0])),
  createOrUpdateWithWhere: (filter, data, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.update(filter, data, {upsert: true} )),
  save: (filter, message, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.update(filter, message)),
  findOne: (message, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.findOne(message)),
  findMany: (filter, collection = '') => db
    .collection(collection || collectionName, configConnection).then(collectionResult => collectionResult.find(filter)
      .toArray()
      .then(result => result)),
  findManyWithSort: (filter, sortData, collection = '') => db
    .collection(collection || collectionName, configConnection).then(collectionResult => collectionResult.find(filter)
      .sort(sortData)
      .toArray()
      .then(result => result)),
  findWithProjection: (filter, projection, collection = '') => db
    .collection(collection || collectionName, configConnection).then(collectionResult => collectionResult
      .findOne(filter, { projection })),
  removeOne: (filter, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.remove(filter)),
  deleteMany: (filter, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.deleteMany(filter)),
});
