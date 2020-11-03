'use strict';

const hapiSwaggered = require('hapi-swaggered');
const { version } = require('../../package.json');
const { plugins: { stripPrefix } } = require('../../config');

const getSwaggerOptions = () => {
  const { path, useRoutePrefix } = stripPrefix;
  const options = {
    info: {
      title: 'API',
      description: 'Swagger',
      version,
    },
  };

  return useRoutePrefix ? { ...options, stripPrefix: path } : { ...options, basePath: path };
};

module.exports = {
  plugin: hapiSwaggered,
  options: getSwaggerOptions(),
};
