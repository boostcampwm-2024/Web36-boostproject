# 리액트 빌드
FROM node:22-alpine AS build

WORKDIR /app/

ENV VITE_BASE_URL=https://www.q-lab.site/api

COPY ./package*.json /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

WORKDIR /app/FE/

COPY ./FE/package*.json /app/FE/

RUN npm install

COPY ./FE /app/FE

COPY ./schemas /app/schemas

RUN npx vite build

# http 서버 생성
FROM nginx:alpine

COPY --from=build /app/FE/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
