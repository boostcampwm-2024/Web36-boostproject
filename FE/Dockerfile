# 리액트 빌드
FROM node:22 AS build

WORKDIR /app

ENV VITE_BASE_URL=http://223.130.155.9/api

COPY package*.json /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . /app

RUN npx vite build

# http 서버 생성
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]