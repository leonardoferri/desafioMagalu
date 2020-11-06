# LUIZA CHALLENGE
> API responsável pelo cadastro de usuários e produtos favoritos vínculados ao cliente.

## Tech Stack

 1. [NodeJs](https://nodejs.org/dist/v14.05.0/)
 2. [HapiJS](https://hapijs.com/)
 3. [MongoDb](https://mongo.com/)


## Dependencies

Describe the main dependencies

### Serviços Internos

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