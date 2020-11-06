const elasticsearch = require('elasticsearch');
const logger = require('../helpers/logger');

const call = (log, config) => new Promise((resolve) => {
  const start = new Date();
  try {
    const esclient = new elasticsearch.Client({ host: config.host })

    esclient.index({
      index: config.index,
      type: config.type,
      body: log
    }, function (error) {
      if (error) {
        logger.error({ message: 'Error send logs', error, start });
      } else {
        logger.info({ message: 'Log sent to ElasticSearch', start });
      }

      resolve();
    })
  } catch (error) {
    logger.error({ message: 'Error send logs', error, start });
    resolve();
  }
});


module.exports = {
  call
}
