'use strict';

const pathPrefix = `/api/${process.env.SERVICE_NAME.replace(/-/g, '')}`;

const getAppData = () => {
  const data = {
    port: process.env.PORT,
    httpsPort: process.env.HTTPS_PORT,
  };
  return data;
};

const getPluginsData = () => {
  const data = {
    swagger: {
      basePath: Object.is(process.env.SWAGGER_VERSIONING, 'true')
        ? `/api/${process.env.SERVICE_NAME.replace(/-/g, '')}/` : '',
    },
    stripPrefix: {
      useRoutePrefix: process.env.USE_ROUTE_PREFIX === 'true',
      path: pathPrefix,
    },
  };
  return data;
};

const stripPrefix = () => ({
  path: `/api/${process.env.SERVICE_NAME.replace(/-/g, '')}`,
});

const getFeatureFlags = () => Object({
  useRoutePrefix: Object.is(process.env.USE_ROUTE_PREFIX, 'true'),
});

const getServicesData = () => ({
  luizaProductsService: process.env.SERVICE_LUIZA_PRODUCTS,
});

const getMongoData = () => {
  const data = {
    uri: process.env.MONGO_URI,
    base: process.env.MONGO_DATABASE,
    cardsLimitInDays: process.env.LIMIT_IN_DAYS,
    timezone: process.env.TIMEZONE,
    collections: {
      collectionCustomer: process.env.MONGO_LUIZA_CUSTOMER_COLLECTION,
    },
  };
  return data;
};

class Config {
  constructor() {
    this.data = {
      mongo: getMongoData(),
      app: getAppData(),
      services: getServicesData(),
      plugins: getPluginsData(),
      stripPrefix: stripPrefix(),
      featureFlags: getFeatureFlags(),
    };
  }

  refresh() {
    this.data.mongo = getMongoData();
    this.data.app = getAppData();
    this.data.plugins = getPluginsData();
    this.data.stripPrefix = stripPrefix();
    this.data.services = getServicesData();
    this.data.featureFlags = getFeatureFlags();
    return this.data;
  }
}

const instance = new Config();
Object.freeze(instance);

module.exports = instance;
