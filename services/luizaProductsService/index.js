'use strict';

const deasync = require('deasync');
const Boom = require('Boom');

const luizaProductsService = ({
  config,
  axios,
}) => {
  const getProductsWithPage = (page) => {
    try {
      const {
        luizaProductsServiceName,
      } = config.services;

      let done = false;
      let retorno = null;
      axios.create({
        baseURL: luizaProductsServiceName,
      }).get(`${luizaProductsServiceName}/?page=${page}`).then((response) => {
        done = true;
        retorno = response;
      }).catch(() => {
        done = true;
      });
      deasync.loopWhile(() => !done);
      if (retorno && retorno.data) {
        const { body } = retorno.data;
        if (body) {
          retorno = body;
        }
      }
      return retorno;
    } catch (e) {
      return e;
    }
  };

  const getProductById = async (productId) => {
    try {
      const {
        luizaProductsServiceName,
      } = config.services;

      const resp = await axios.create({
        baseURL: luizaProductsService,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).get(`${luizaProductsServiceName}/${productId}/`, {
        params: {
          productId: productId,
        },
      });

      const objReturned = resp.data;

      if (typeof objReturned === 'object') {
        if (Object.entries(objReturned).length === 0 && objReturned.constructor === Object === true) {
          throw Boom.notFound('Produto não encontrado.');
        }
        return objReturned;
      }
    } catch (e) {
      throw e;
    }
  };

  return {
    getProductsWithPage,
    getProductById,
  };
};

module.exports = luizaProductsService;
