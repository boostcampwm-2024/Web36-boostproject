# 리액트 빌드
FROM node:22 AS build

WORKDIR /app

COPY package.json /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install vite

RUN npm install

COPY . /app

RUN vite build

# http 서버 생성
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]