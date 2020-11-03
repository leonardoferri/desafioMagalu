'use strict';

const hapiSwaggeredUI = require('hapi-swaggered-ui');

module.exports = {
  plugin: hapiSwaggeredUI,
  options: {
    title: 'Swagger UI',
    path: '/docs',
    swaggerOptions: {
      validatorUrl: null,
    },
  },
};
