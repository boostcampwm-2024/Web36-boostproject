FROM node:22

WORKDIR /app

# Secret 파일 경로 설정
ENV DB_PASSWORD_FILE="/run/secrets/db_password"
ENV QUERY_DB_PASSWORD_FILE="/run/secrets/query_db_password"
ENV SESSION_SECRET_FILE="/run/secrets/session_secret"

COPY package*.json /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3000

CMD npm run start:prod