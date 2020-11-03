'use strict';

const application = require('../../package.json');
const luizaChallengeController = require('./luizaChallengeController');

module.exports = (adapters, config) => ({
  getCustomer: luizaChallengeController(
    adapters,
    application.name,
    config,
  ).getCustomer,
  upsertProduct: luizaChallengeController(
    adapters,
    application.name,
    config,
  ).upsertProduct,
  upsertCustomer: luizaChallengeController(
    adapters,
    application.name,
    config,
  ).upsertCustomer,
  deleteCustomer: luizaChallengeController(
    adapters,
    application.name,
    config,
  ).deleteCustomer,
});
