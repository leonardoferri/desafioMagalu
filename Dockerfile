FROM node:8.11

RUN npm install -g pm2@2.10.4

COPY ./ /app

RUN cd /app \
    && npm install

WORKDIR /app

CMD ["npm", "start"]
