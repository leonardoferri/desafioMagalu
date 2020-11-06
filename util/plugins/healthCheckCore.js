'use strict';

const axios = require('axios');
const ping = require('ping');
const mongo = require('mongoose');

module.exports = async (verbose, options, pjson) => {

  const start = new Date();

  const pings = options.pings.map(item => new Promise(async (resolve) => {
    await ping.promise.probe(item.host)
      .then((response) => {
        resolve({
          type: 'Ping',
          name: item.name,
          status: response.alive ? 200 : 500,
          data: verbose ? response : null,
        });
      })
      .catch((error) => {
        resolve({
          type: 'Ping Error',
          name: item.name,
          status: 500,
          error: verbose ? error.message : true,
        });
      });
  }));
  const requests = options.requests.map(item => new Promise(async (resolve) => {
    await axios({
      method: item.method,
      url: item.url,
      timeout: item.timeout,
      headers: item.headers,
      data: item.data,
    }).then((response) => {
      resolve({
        type: 'Request',
        name: item.name,
        status: response.status,
        data: verbose ? response.data : true,
      });
    })
      .catch((error) => {
        resolve({
          type: 'Request Error',
          name: item.name,
          status: 500,
          error: verbose ? error.message : true,
        });
      });
  }));

  const mongodbs = options.mongodbs.map(item => new Promise(async (resolve) => {
    await mongo.connect(item.url)
      .then(() => {
        mongo.disconnect();
        resolve({
          type: 'MongoDB Connection',
          name: item.name,
          status: 200,
        });
      })
      .catch(() => {
        resolve({
          type: 'MongoDB Connection Error',
          name: item.name,
          status: 500,
        });
      });
  }));

  const services = [
    ...await Promise.all(requests),
    ...await Promise.all(pings),
    ...await Promise.all(mongodbs),
  ];

  const hasError = !!services.find(item => item.status === 500);

  return {
    uptime: process.uptime(),
    nodeVersion: process.version,
    version: pjson.version,
    status: hasError ? 500 : 200,
    duration: new Date() - start,
    services,
  };
}
