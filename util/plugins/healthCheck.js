'use strict';

const coreHealthCheck = require('./healthCheckCore');

module.exports = pjson => ({
  pkg: pjson,
  async register(server, options) {
    server.route({
      method: 'GET',
      path: '/health',
      async handler(request, h) {

        const data = await coreHealthCheck(request.query.v, options, pjson);

        return h.response(data).code(data.status ? 500 : 200);
      },
    });
  },
});
