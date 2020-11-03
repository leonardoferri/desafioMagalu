'use strict';

const luizaChallengeWrapper = ({
  config,
  repositoryMongoDb,
  Boom,
  luizaProductsService,
}) => {

  const getCustomer = async ({
    payload,
    onSuccess,
    onError,
  }) => {
    try {

      const {
        email,
      } = payload;

      const filter = { 
        email: email,
      };

      const collectionName = config.mongo.collections.collectionCustomer

      const getCustomer = await repositoryMongoDb.collectionFactory.findMany(
        filter,
        collectionName,
      );

      return onSuccess(getCustomer);
    } catch (errorCatch) {
      let error = errorCatch;
      if (errorCatch.output == null) {
        error = Boom.badGateway(error);
      }
      return onError(error.output.payload);
    }
  };

  const upsertProduct = async ({
    payload,
    onSuccess,
    onError,
  }) => {
    try {

      const {
        email,
        productId,
      } = payload;

      const filter = { 
        email: email,
      };

      const collectionName = config.mongo.collections.collectionCustomer

      const getProductByid = await luizaProductsService.getProductById(productId);

      const createOrUpdateCustomer = await repositoryMongoDb.collectionFactory.createOrUpdateWithWhere(
        filter,
        {
          $addToSet: { productList: getProductByid },
        },
          collectionName,
      );

      const response = {
        message: "Mongo Atualizado com Sucesso!",
      };

      return onSuccess(response);
    } catch (errorCatch) {
      let error = errorCatch;
      if (errorCatch.output == null) {
        error = Boom.badGateway(error);
      }
      return onError(error.output.payload);
    }
  };

  const upsertCustomer = async ({
    payload,
    onSuccess,
    onError,
  }) => {
    try {

      const {
        name,
        email,
      } = payload;

      const filter = { 
        email: email,
      };

      const collectionName = config.mongo.collections.collectionCustomer

      const createOrUpdateCustomer = await repositoryMongoDb.collectionFactory.createOrUpdateWithWhere(
        filter,
        { 
          $set: { name: name}
        },
        collectionName,
      );

      const response = {
        message: "Cliente inserido/atualizado com sucesso!",
      };

      return onSuccess(response);
    } catch (errorCatch) {
      let error = errorCatch;
      if (errorCatch.output == null) {
        error = Boom.badGateway(error);
      }
      return onError(error.output.payload);
    }
  };

  const deleteCustomer = async ({
    payload,
    onSuccess,
    onError,
  }) => {
    try {

      const {
        email,
      } = payload;

      const filter = { 
        email: email,
      };

      const collectionName = config.mongo.collections.collectionCustomer

      const removeCustomer = await repositoryMongoDb.collectionFactory.removeOne(
        filter,
        collectionName,
      );

      const response = {
        message: "Cliente Excluído com Sucesso!"
      };

      return onSuccess(response);
    } catch (errorCatch) {
      let error = errorCatch;
      if (errorCatch.output == null) {
        error = Boom.badGateway(error);
      }
      return onError(error.output.payload);
    }
  };

  return {
    getCustomer,
    upsertProduct,
    upsertCustomer,
    deleteCustomer,
  };

};

module.exports = luizaChallengeWrapper;
