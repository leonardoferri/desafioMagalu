'use strict';

const deasync = require('deasync');

const luizaProductsService = ({
  config,
  axios,
}) => {
  const getProductsWithPage = (page) => {
    try {
      const {
        luizaProductsService,
      } = config.services;

      let done = false;
      let retorno = null;
      axios.create({
        baseURL: luizaProductsService,
      }).get(`${luizaProductsService}/?page=${page}`).then((response) => {
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
        luizaProductsService,
      } = config.services;

      const resp = await axios.create({
        baseURL: luizaProductsService,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).get(`${luizaProductsService}/${productId}/`, {
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
