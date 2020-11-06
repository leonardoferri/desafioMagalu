const loggerHandler = require('../helpers/loggerHandler');
const esClient = require('./esClient');

const error = (log, config) => esClient.call(loggerHandler(log), config);

const warn = (log, config) => esClient.call(loggerHandler(log), config);

const info = (log, config) => esClient.call(loggerHandler(log), config);

const verbose = (log, config) => esClient.call(loggerHandler(log), config);

const debug = (log, config) => esClient.call(loggerHandler(log), config);

const silly = (log, config) => esClient.call(loggerHandler(log), config);

module.exports = (config) => ({
  error: (log) => error(log, config),
  warn: (log) => warn(log, config),
  info: (log) => info(log, config),
  verbose: (log) => verbose(log, config),
  debug: (log) => debug(log, config),
  silly: (log) => silly(log, config),
})
