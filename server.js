'use strict';

const { Authorizing } = require('./util');
const Hapi = require('@hapi/hapi');
const config = require('./config');
const routes = require('./v1/routes');
const plugins = require('./plugins');

module.exports = (async () => {
  const server = Hapi.server({ port: config.app.port, router: { isCaseSensitive: false } });
  const { path, useRoutePrefix } = config.plugins.stripPrefix;

  if (useRoutePrefix) {
    server.realm.modifiers.route.prefix = path;
  }
  await server.register(plugins);
  await Authorizing().setupPlugin(server);
  server.route(routes);

  return server;
})();
