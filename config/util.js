'use strict';

const deasync = require('deasync');

const { AWS } = require('pkg_sky_core');

require('dotenv').config();

const ENV = process.env.NODE_ENV;

const application = require('../package.json');

const path = `/${application.name}/${ENV}/`;

process.env.SERVICE_NAME = application.name;

const defaultConfig = require('./default');

const util = {
  refreshConfig() {
    let done = false;
    AWS.refreshAllParameterStoreByPath(path.toLocaleLowerCase())
      .then((result) => {
        if (result.status === 'OK') {
          this.config = defaultConfig.refresh();
        }
        done = true;
      })
      .catch(() => {
        done = true;
        this.config = defaultConfig.refresh();
      });

    deasync.loopWhile(() => !done);
    return this.config;
  },
};

module.exports = util;
