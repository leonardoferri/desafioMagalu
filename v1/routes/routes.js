'use strict';

const controller = require('../controllers');
const { luizaChallengeSchema } = require('../schemas');

const getCustomer = {
  path: '/v1/luizaChallenge/getCustomer',
  method: 'GET',
  config: {
    description: 'Description',
    notes: 'Describe your notes here',
    tags: ['api'],
    handler: controller.getCustomer,
    validate: {
      options: {
        allowUnknown: true,
      },
      query: luizaChallengeSchema.request.getCustomer,
    },
  },
};

const upsertProduct = {
  path: '/v1/luizaChallenge/product/upsert',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: controller.upsertProduct,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: luizaChallengeSchema.request.upsertProduct,
    },
  },
};

const upsertCustomer = {
  path: '/v1/luizaChallenge/customer/upsert',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: controller.upsertCustomer,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: luizaChallengeSchema.request.upsertCustomer,
    },
  },
};

const deleteCustomer = {
  path: '/v1/luizaChallenge/customer/delete',
  method: 'DELETE',
  config: {
    tags: ['api'],
    handler: controller.deleteCustomer,
    validate: {
      options: {
        allowUnknown: true,
      },
      query: luizaChallengeSchema.request.deleteCustomer,
    },
  },
};

module.exports = {
  getCustomer,
  upsertProduct,
  upsertCustomer,
  deleteCustomer,
};
