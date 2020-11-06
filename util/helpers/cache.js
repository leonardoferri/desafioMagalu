const logger = require('../helpers/logger');
const Memcached = require('memcached');

const get = ({ memcached, enabled }) => (cacheKey) => {
  return new Promise((resolve) => {
    if (!enabled) {
      logger.info({ message: `Get Cache Key ${cacheKey} disabled` });
      return resolve();
    }

    logger.info({ message: `Get Cache Key ${cacheKey}` });

    memcached.get(cacheKey, (error, data) => {
      if (error) {
        logger.error({ message: `Get Cache Key ${cacheKey} error`, error });
        return resolve();
      }

      if (!data) {
        logger.info({ message: `Get Cache Key ${cacheKey} empty` });
        return resolve();
      }

      logger.info({ message: `Get Cache Key ${cacheKey} success` });
      return resolve(data);
    });
  });
};

const getMulti = ({ memcached, enabled }) => (arrCacheKey) => {
  return new Promise((resolve) => {
    const cacheKeyToString = arrCacheKey.reduce((a, b) => a.concat(b));
    if (!enabled) {
      logger.info({ message: `Get Cache Key ${cacheKeyToString} disabled` });
      return resolve();
    }

    logger.info({ message: `Get Cache Key ${cacheKeyToString}` });

    memcached.getMulti(arrCacheKey, (error, data) => {
      if (error) {
        logger.error({ message: `Get Cache Key ${cacheKeyToString} error`, error });
        return resolve();
      }

      if (!data) {
        logger.info({ message: `Get Cache Key ${cacheKeyToString} empty` });
        return resolve();
      }

      logger.info({ message: `Get Cache Key ${cacheKeyToString} success` });
      return resolve(data);
    });
  });
};

const set = ({ memcached, enabled }) => (cacheKey, time, object) => {
  return new Promise((resolve) => {
    if (!enabled) {
      logger.info({ message: `Set Cache Key ${cacheKey} disabled` });
      return resolve();
    }

    if (!object) {
      logger.error({ message: `Set Cache Key ${cacheKey} not cached because it is null` });
      return resolve();
    }
    memcached.set(cacheKey, object, parseInt(time), (error) => {
      if (error) {
        logger.error({ message: `Set Cache Key ${cacheKey} error`, error });
      } else {
        logger.info({ message: `Set Cache Key ${cacheKey} cached for ${time} seconds` });
      }

      return resolve();
    });
  });
};

const remove = ({ memcached, enabled }) => (cacheKey) => {
  return new Promise((resolve) => {
    if (!enabled) {
      logger.info({ message: `Remove Cache Key ${cacheKey} disabled` });
      return resolve();
    }

    logger.info({ message: `Remove Cache Key ${cacheKey}` });
    memcached.del(cacheKey, (error) => {
      if (error) {
        logger.error({ message: `Remove Cache Key ${cacheKey}`, error });
        return resolve();
      }

      logger.info({ message: `Remove Cache Key ${cacheKey} success` });

      return resolve();
    });
  });
}

const items = ({ memcached, enabled }) => () => {
  return new Promise((resolve, reject) => {
    let itemlist = [];
    if (!enabled) {
      return resolve();
    }
    memcached.items((error, data) => {
      if (error) {
        logger.error({ message: `Error while getting items: ${error}`, error });
        return reject(error);
      }
      if (!data) {
        logger.info({ message: `Items return empty` });
        return resolve([]);
      }

      const [objData] = data;
      const keys = Object.keys(objData);
      keys.pop();
      let count = keys.length;
      if (count === 0) {
        return resolve([]);
      }
      keys.forEach(element => {
        memcached.cachedump(objData.server, parseInt(element, 10), objData[element].number, (errr, objList) => {
          count--;
          if (objList) {
            itemlist = itemlist.concat(Array.isArray(objList) ? objList : [objList]);
          }

          if (count === 0) {
            logger.info({ message: `Items retrieved successfully` });
            return resolve(itemlist);
          }
        });
      });
    });
  });
};

const flush = ({ memcached, enabled }) => () => {
  return new Promise((resolve, reject) => {
    if (!enabled) {
      logger.info({ message: `Flush disabled` });
      return resolve();
    }
    memcached.flush((error, data) => {
      if (error) {
        logger.error({ message: `Flush error: ${error}`, error });
        return reject(error);
      }
      if (!data) {
        logger.info({ message: `Flush return empty` });
        return resolve();
      }
      logger.info({ message: `Flush success` });
      return resolve(data);
    });
  });
};

module.exports = ({ server, enabled = true }) => {

  const memcached = new Memcached(server, { retries: 2, retry: 2000, remove: true, timeout: 5000, maxValue: 3145728 });

  return {
    get: cacheKey => get({ memcached, enabled })(cacheKey),
    getMulti: arrCacheKey => getMulti({ memcached, enabled })(arrCacheKey),
    set: (cacheKey, time, object) => set({ memcached, enabled })(cacheKey, time, object),
    remove: cacheKey => remove({ memcached, enabled })(cacheKey),
    items: () => items({ memcached, enabled })(),
    flush: () => flush({ memcached, enabled })(),
  }
}
