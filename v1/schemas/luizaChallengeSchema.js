'use strict';

const Joi = require('joi');

module.exports = {
  request: {
    getCustomer: {
      email: Joi.string().required(),
    },
    upsertCustomer: {
      name: Joi.string().required(),
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    },
    upsertProduct: {
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      productId : Joi.string().required(),
    },
    deleteCustomer: {
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    },
    deleteProduct: {
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      productId : Joi.string().required(),
    }
  },
};
