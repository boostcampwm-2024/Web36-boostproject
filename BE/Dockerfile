FROM node:20-alpine

WORKDIR /app/

RUN npm install -g pm2

COPY ./package*.json /app

RUN npm install

WORKDIR /app/BE/

COPY ./BE/package*.json /app/BE/

RUN npm install

COPY ./BE /app/BE

COPY ./schemas /app/schemas

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]