# BFB-MS-LIFERAY-HUB
> Microserviço responsável pela visualização de artigos dentro do Mongo de conteúdos da Liferay (Datamind).

## Tech Stack

 1. [NodeJs 8.10 +](https://nodejs.org/dist/v8.10.0/)
 2. [HapiJS](https://hapijs.com/)
 3. [MongoDb](https://mongo.com/)


 ## Fluxo de visualização de conteúdos de carrosséis e páginas:
![Alt](liferay-hub-visualizacao.png)

## Dependencies

Describe the main dependencies

### Internal Services

Describe the internal services used by the project.

1.  bfb-ms-catalog
2.  bfb-ms-cms

### External Services

Describe the external services used by the project.

1.  AWS APIs
2.  Google APIs

## Variables Local

Variables local used for running and debugging the application

```
SERVICE_NAME=bff-ms-sample
NODE_ENV=development
LOG_PATH=./
DB_URL=mongodb://localhost:27017/microservices
DB_NAME=microservices
PORT=3001
HTTPS_PORT=3002
```

## Run Application

How to run the application

```
npm start
```

## Run Tests

How to run the tests

```
npm run test
```