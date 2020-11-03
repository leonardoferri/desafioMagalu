'use strict';

const { ResponseHandler } = require('pkg_sky_core');

const luizaChallengeWrapper = (adapters, applicatioName) => {

  const getCustomer = (request, reply) => {
    const payload = {
      ...request.query,
      applicationName: applicatioName,
    };
    return adapters.getCustomer({
      payload,
      onSuccess: (data) => {
        ResponseHandler.successHandler({
          payload, request, response: data,
        });
        return reply.response(data).code(200);
      },
      onError: (error) => {
        ResponseHandler.errorHandler({
          payload, request, error,
        });
        return reply.response(error).code(error.statusCode);
      },
    });
  };

  const upsertProduct = (request, reply) => {
    const payload = {
      ...request.payload,
      applicationName: applicatioName,
    };
    return adapters.upsertProduct({
      payload,
      onSuccess: (data) => {
        ResponseHandler.successHandler({
          payload, request, response: data,
        });
        return reply.response(data).code(200);
      },
      onError: (error) => {
        ResponseHandler.errorHandler({
          payload, request, error,
        });
        return reply.response(error).code(error.statusCode);
      },
    });
  };

  const upsertCustomer = (request, reply) => {
    const payload = {
      ...request.payload,
      applicationName: applicatioName,
    };
    return adapters.upsertCustomer({
      payload,
      onSuccess: (data) => {
        ResponseHandler.successHandler({
          payload, request, response: data,
        });
        return reply.response(data).code(200);
      },
      onError: (error) => {
        ResponseHandler.errorHandler({
          payload, request, error,
        });
        return reply.response(error).code(error.statusCode);
      },
    });
  };

  const deleteCustomer = (request, reply) => {
    const payload = {
      ...request.query,
      applicationName: applicatioName,
    };
    return adapters.deleteCustomer({
      payload,
      onSuccess: (data) => {
        ResponseHandler.successHandler({
          payload, request, response: data,
        });
        return reply.response(data).code(200);
      },
      onError: (error) => {
        ResponseHandler.errorHandler({
          payload, request, error,
        });
        return reply.response(error).code(error.statusCode);
      },
    });
  };

  return {
    getCustomer,
    upsertProduct,
    upsertCustomer,
    deleteCustomer,
  };
};

module.exports = luizaChallengeWrapper;

