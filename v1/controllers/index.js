'use strict';

const axios   = require('axios');
const Boom    = require('boom');
const factory = require('./factory');
const config  = require('../../config');
const util    = require('../../config/util');
const repositoryMongoDb = require('../repository/mongoDb');
const bcrypt = require('bcryptjs');

const {
  luizaProductsService,
} = require('../../services')({
  axios,
  Boom,
  config,
});

const adapters = require('../adapters')({
  config,
  util,
  repositoryMongoDb,
  Boom,
  luizaProductsService,
});

module.exports = factory(adapters, config);
