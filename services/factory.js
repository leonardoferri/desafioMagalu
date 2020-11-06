'use strict';

const luizaProductsService = require('./luizaProductsService');

module.exports = dependencies => ({
  luizaProductsService: luizaProductsService(dependencies),
});
