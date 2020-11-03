'use strict';

const luizaChallengeWrapper = require('./luizaChallenge');

module.exports = dependencies => ({
  getCustomer: luizaChallengeWrapper({
    config: dependencies.config,
    repositoryMongoDb: dependencies.repositoryMongoDb,
    Boom: dependencies.Boom,
  }).getCustomer,
  upsertProduct: luizaChallengeWrapper({
    config: dependencies.config,
    repositoryMongoDb: dependencies.repositoryMongoDb,
    Boom: dependencies.Boom,
    luizaProductsService: dependencies.luizaProductsService,
  }).upsertProduct,
  upsertCustomer: luizaChallengeWrapper({
    config: dependencies.config,
    repositoryMongoDb: dependencies.repositoryMongoDb,
    Boom: dependencies.Boom,
    luizaProductsService: dependencies.luizaProductsService,
  }).upsertCustomer,
  deleteCustomer: luizaChallengeWrapper({
    config: dependencies.config,
    repositoryMongoDb: dependencies.repositoryMongoDb,
    Boom: dependencies.Boom,
  }).deleteCustomer,
});
