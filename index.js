'use strict';

const { Logger } = require('pkg_sky_core');
const server = require('./server');

const init = async () => {
  const serverInstance = await server;
  try {
    await serverInstance.start();

    Logger.info({
      message: `App running on ${serverInstance.info.protocol}://
    ${serverInstance.info.host}:${serverInstance.info.port}`,
    });

  } catch (error) {
    Logger.info({ message: `App failed to start ${error.message}` });
  }
};

init();
