'use strict';

module.exports = ({ db, collectionName, configConnection }) => ({
  createOrUpdateWithWhere: (filter, data, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.updateOne(filter, data, { upsert: true })),
  findMany: (filter, collection = '') => db
    .collection(collection || collectionName, configConnection).then(collectionResult => collectionResult.find(filter)
      .toArray()
      .then(result => result)),
  removeOne: (filter, collection = '') => db
    .collection(collection || collectionName, configConnection)
    .then(collectionResult => collectionResult.deleteOne(filter)),
});
