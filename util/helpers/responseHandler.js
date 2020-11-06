'use strict';

const Logger = require('./logger')
const uuid = require('uuid/v1');
const { MongoError } = require('mongodb');

const genericError = (params) => {

  // Flag para gravar response no log
  const logData = Object.is(process.env.LOG_DATA, 'true') ;

  //DOCKER PARAMS
  const {payload, request, error} = params;

  //LAMBDA PARAMS
  const {event, start, config} = params;

  if (event) {

    const onConfig = () => ({
      application: config.logs.application,
      environment: config.logs.environment,
    });

    const log = {
      statusCode: 500,
      application: config.logger.name,
      environment: config.environment,
      error,
      event,
      headers: event.headers,
      processId: uuid(),
      start,
    };
    Logger.sendEs(log, onConfig(), logData);

    //RESPONSE OBJECT
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
      }),
    }

    if (error instanceof MongoError) {
      response.body.message = error.name
    }

    return response;
  }

  const date = new Date(request.headers['x-req-start']);
  const { headers, path, method } = request;
  const statusCode = error.statusCode || error.status_code || 500;

  const errorMessages = {
    GENERIC_ERROR: error.message || 'Fail hard',
  };

  const loggerConfig = {
    application: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
  };

  let responseObject = error;

  if(error instanceof Error){
    responseObject = {
      message: error.message,
      stack: error.stack,
    }
  }

  Logger.sendFileV2({
    processId: uuid(),
    message: errorMessages.GENERIC_ERROR,
    start: date,
    statusCode,
    path,
    responseObject,
    body: payload,
    headers,
    consumerIp: request.info.remoteAddress,
    httpMethod: method,
    error,
  }, loggerConfig, logData);

  return {
    statusCode,
    result: error,
  };
};

const genericSuccess = (param) => {

  // Flag para gravar response no log
  const logData = Object.is(process.env.LOG_DATA, 'true') ;

  // DOCKER PARAMS
  const { custom, payload, request, response } = param;

  // LAMBDA PARAMS
  const { event, context, config, data, start } = param;

  if(context != null) {
    context.newValue = 1;
  }

  if (event) {

    const onConfig = () => ({
      application: config.logs.application,
      environment: config.logs.environment,
    });

    const log =  {
      statusCode: 200,
      responseObject: data,
      application: config.logger.name,
      environment: config.environment,
      event,
      headers: event.headers,
      message: data.message ? data.message: '' ,
      processId: uuid(),
      start,
    };

    Logger.sendEs(log, onConfig(), logData);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: event.headers
    };

  }

  const date = new Date(request.headers['x-req-start']);
  const { server, info, headers, path, method } = request;
  const statusCode = response.statusCode ? response.statusCode : 200;

  const loggerConfig = {
    application: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
  };

  Logger.sendFileV2({
    processId: uuid(),
    message: 'Success',
    start: date,
    statusCode,
    path,
    responseObject: response,
    body: payload,
    custom,
    headers,
    serverIp: server.info.address,
    consumerIp: info.remoteAddress,
    httpMethod: method,
  }, loggerConfig, logData);

  return response;

};

module.exports = {
  errorHandler: (log) => genericError(log),
  successHandler: (log) => genericSuccess(log),
};
