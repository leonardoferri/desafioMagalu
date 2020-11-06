'use strict';

const {
  getCustomer,
  upsertProduct,
  upsertCustomer,
  deleteCustomer,
  deleteProduct,
} = require('./routes');

module.exports = [
  getCustomer,
  upsertProduct,
  upsertCustomer,
  deleteCustomer,
  deleteProduct,
];
