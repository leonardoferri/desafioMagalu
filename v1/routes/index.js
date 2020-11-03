'use strict';

const {
  getCustomer,
  upsertProduct,
  upsertCustomer,
  deleteCustomer,
} = require('./routes');

module.exports = [
  getCustomer,
  upsertProduct,
  upsertCustomer,
  deleteCustomer,
];
