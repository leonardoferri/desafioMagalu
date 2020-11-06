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

      const { email } = payload;
      const filter = {
        email: email,
      };

      const collectionName = config.mongo.collections.collectionCustomer;

      const customer = await repositoryMongoDb.collectionFactory.findMany(
        filter,
        collectionName,
      );

      return onSuccess(customer);
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

      const collectionName = config.mongo.collections.collectionCustomer;

      const getProductByid = await luizaProductsService.getProductById(productId);

      await repositoryMongoDb.collectionFactory.createOrUpdateWithWhere(
        filter,
        {
          $addToSet: { productList: getProductByid },
        },
        collectionName,
      );

      const response = {
        message: `Produto ${productId} inserido/atualizado com sucesso!`,
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

      const collectionName = config.mongo.collections.collectionCustomer;

      await repositoryMongoDb.collectionFactory.createOrUpdateWithWhere(
        filter,
        {
          $set: {
            name: name,
          },
        },
        collectionName,
      );

      const response = {
        message: `Cliente ${name} inserido/atualizado com sucesso!`,
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

      const collectionName = config.mongo.collections.collectionCustomer;

      await repositoryMongoDb.collectionFactory.removeOne(
        filter,
        collectionName,
      );

      const response = {
        message: `Cliente ${email} Excluído com Sucesso!`,
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

  const deleteProduct = async ({
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

      const collectionName = config.mongo.collections.collectionCustomer;

      await repositoryMongoDb.collectionFactory.createOrUpdateWithWhere(
        filter,
        {
          $pull: {
            productList: {
              id: productId,
            },
          },
        },
        collectionName,
      );

      const response = {
        message: `Produto ${productId} Excluído da Lista de Favoritos do Cliente ${email} com sucesso!`,
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
    deleteProduct,
  };

};

module.exports = luizaChallengeWrapper;
