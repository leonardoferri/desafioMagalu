# LUIZA CHALLENGE
> API responsável pelo cadastro de usuários e produtos favoritos vínculados ao cliente.

## Tech Stack

 1. [NodeJs](https://nodejs.org/dist/v14.05.0/)
 2. [HapiJS](https://hapijs.com/)
 3. [MongoDb](https://mongo.com/)


## Dependencies

    "@hapi/hapi": "^17.9.0",
    "@hapi/inert": "^5.2.0",
    "@hapi/vision": "^5.5.2",
    "aws-sdk": "^2.786.0",
    "axios": "^0.21.0",
    "bluebird": "^3.7.2",
    "boom": "^7.3.0",
    "deasync": "^0.1.13",
    "dotenv": "^8.0.0",
    "elasticsearch": "^16.7.1",
    "hapi-alive": "^2.0.4",
    "hapi-response-time": "^2.0.0",
    "hapi-swaggered": "^3.0.2",
    "hapi-swaggered-ui": "^3.0.1",
    "http-status-codes": "^2.1.4",
    "joi": "^14.3.1",
    "memcached": "^2.2.2",
    "mongodb": "^3.1.1",
    "mongoose": "^5.10.12",
    "ping": "^0.3.0",
    "remove-accents": "^0.4.2",
    "underscore": "^1.11.0",
    "uuid": "^3.2.1",
    "winston": "^3.3.3",
    "winston-daily-rotate-file": "^4.5.0"
    "sinon": "^7.3.2",
    "chai": "^4.1.2",
    "depcheck": "^0.8.0",
    "eslint": "^5.16.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.9.0",
    "eslint-plugin-jsx-a11y": "^6.0.3",
    "eslint-plugin-react": "^7.7.0",
    "husky": "^2.3.0",
    "mocha": "^6.1.4",
    "nodemon": "^1.17.1",
    "nyc": "^14.1.1"

### Internal Services

1.  [API DE PÁGINAS](http://challenge-api.luizalabs.com/api/product/?page=<PAGINA>)
2.  [API DE PRODUTOS](http://challenge-api.luizalabs.com/api/product/<ID>/)



## Variables Local

Para rodar o projeto, criar uma .env no diretório raiz e colar variáveis abaixo:

```
USE_ROUTE_PREFIX=true
NODE_ENV=dev
PORT=3001
HTTPS_PORT=3002
SERVICE_NAME=desafioMagalu
LOG_PATH=/mnt/log/microservice/
SWAGGER_VERSIONING=false
################################# MONGO #################################
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=DB_LUIZA
MONGO_LUIZA_CUSTOMER_COLLECTION=LUIZA_CUSTOMERS
######################## SERVICE PRODUCTS CONFIG ########################
SERVICE_LUIZA_PRODUCTS=http://challenge-api.luizalabs.com/api/product
SECRET_KEY=lusLpPwtdvDFOlqelGM/W0htD01aW99XBfY5bFXwOe1HkxsjUDoyq1bFm3M7qsWe7DIZrCdv5ky8JLb6s1iIk26GdvoNxQE4oS6g+RqFQdNhwJ83n4pKD6UU5gROiShOAl8Ai/dO+sQGKonX9H6K4hWioMvXqtjjPmqZY+BA+wTN+IqQf3va8Kwgih/bx9+lRlMj+GiixS7Vkl3NgcVhjsUm6rrdiifatUtJhJpLnW5q+u3axSmYe1viqSNrCGVeFmldAILrBzG7yObJBuZih5Y0hp6GqDdFg4nLo/zv7wgpAHv3TzjGYclciK1QDMQm2JZV2H3obBXDFzFhpkHfrQ==
ALGORITHM_JWT=HS256
```

## Run Application

- Para executar a aplicação é necessário estar com uma base do mongo configurada localmente na localhost:27017;
- Após inicializar o mongo é só dar o comando de inicialização do projeto, conforme abaixo:

```
npm start - PARA STARTAR A APLICAÇÃO
```

## Run Tests

Para executar os testes com cobertura e eslint, é só rodar o comando abaixo.

```
npm run test - PARA RODAR O ESLINT E OS TESTES UNITÁRIOS DO MOCHA/CHAI (Cobertura não está em 100%)
```

## OBS

- A camada de login estava sendo feita com JWT, mas não consegui implementar devido a alguns erros locais,e afim de não compromoter dados e devido ao tempo, preferi deixar sem e garantir a qualidade na entrega.
- /util é uma camada de log e authorization que implementei, se quiserem visualizar, fiquem a vontade.

Qualquer dúvida, podem entrar em contato comigo :)
