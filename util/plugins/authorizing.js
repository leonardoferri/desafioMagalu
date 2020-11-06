'use strict';

const Logger = require("../helpers/logger");
const authorizer = require('../services/authorizer');
const getProperty = require('../common/getProperty');

const Authorizing = () => {
  const softStrategyName = 'SoftTokenAuth';
  const hardStrategyName = 'HardTokenAuth';

  const softAuthenticate = (request, nextAction) => authenticate(request, nextAction, true);
  
  const hardAuthenticate = (request, nextAction) => authenticate(request, nextAction, false);

  const SoftTokenScheme = () => ({ credentials: null, isValid: false, authenticate: softAuthenticate });
  
  const HardTokenScheme = () => ({ credentials: null, isValid: false, authenticate: hardAuthenticate });

  const isValidSignature = (signatureId, credentials) => {
    if (!signatureId) return true;
    
    const signature = credentials.signatureList.filter(id => id === signatureId);

    return !!signature.length;
  }

  const authenticate = async (request, nextAction, continueRequest) => {

    const { headers, query, params } = request;
    const { authorization } = headers;
    const consumerSystem = headers['x-consumer-system'];
    const userId = headers['x-user-id'];
    const signature = query['signature'] || headers['signature'] || params['signature'];
    const statusUnauthorized = 401;

    if (continueRequest && !authorization) {
      return nextAction.continue;
    }

    try {
      const credentials = await authorizer.get({ token: authorization, consumerSystem, userId });

      if (!isValidSignature(signature, credentials)) {
        if (continueRequest) {
          return nextAction.continue;
        }

        return nextAction
            .response({ message: 'unauthorized' })
            .code(statusUnauthorized)
            .takeover();
      }
      
      request.auth.isAuthorized = true;
      return nextAction.authenticated({ credentials });
    } catch (error) {
      if (continueRequest && getProperty('response.status', error) === statusUnauthorized) {
        return nextAction.continue;
      }

      Logger.error({
        message: `Erro ao tentar autorizar usuario por token ${error.name} ${error.message}`,
      });

      return nextAction
            .response({ message: 'unauthorized' })
            .code(statusUnauthorized)
            .takeover();
    }
  };

  const setupPlugin = async (server) => {
    server.auth.scheme(softStrategyName, SoftTokenScheme);
    server.auth.scheme(hardStrategyName, HardTokenScheme);
    await server.auth.strategy('soft-authorizer', softStrategyName, { SoftTokenScheme });
    await server.auth.strategy('hard-authorizer', hardStrategyName, { HardTokenScheme });
  };

  return {
    setupPlugin,
  };
};

module.exports = Authorizing;