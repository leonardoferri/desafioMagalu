'use strict';

const axios = require('axios');


const qaDataService = (() => {
  const instance = axios.create({
    baseURL: process.env.URL_QADATA_DEFINIR,
    timeout: process.env.Timeout_QADATA || 25000
  });

  const get = async () => {
    const response = await instance.get('/v1/scenarios');
    return response.data;
  };

  const getScenarioById = async ({ scenarioId }) => {
    const response = await instance.get(`/v1/scenarios/${scenarioId}`, { params: scenarioId });
    return response.data;
  };

  const getScenarioExecution = async ({ scenarioId }) => {
    const response = await instance.get(`/v1/scenarios/${scenarioId}/execution?rows=1`, { params: scenarioId });

    return response.data;
  }

  const getScenarioReservation = async ({ scenarioId }) => {
    const response = await instance.get(`/v1/scenarios/${scenarioId}/reservations`, { params: scenarioId });
    return response.data;
  }

  const getReservations = async () => {
    const response = await instance.get('/v1/reservations');
    return response.data;
  }
  const getReservationById = async ({ reservationId }) => {
    const response = await instance.get(`/v1/reservations/${reservationId}`, { params: reservationId });
    return response.data;
  }
  return {
    get,
    getScenarioById,
    getScenarioExecution,
    getScenarioReservation,
    getReservations,
    getReservationById
  }
})();

module.exports = qaDataService;
