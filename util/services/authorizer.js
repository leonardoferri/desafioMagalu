'use strict';

const axios = require('axios');

const authorizerService = (() => {
  
  const get = async ({ token, consumerSystem, userId }) => {
    const instance = axios.create({
      baseURL: process.env.URL_DO_AUTORIZADOR,
      headers: {
        'x-consumer-system': consumerSystem,
        'x-user-id': userId,
      },
      timeout: 10000
    });

    instance.defaults.headers.token = token;
    const response = await instance.get('/v1/authorizers');
    return response.data;
  };

  return { get };
})();

module.exports = authorizerService;
