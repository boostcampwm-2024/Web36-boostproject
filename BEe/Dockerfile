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

CMD export DB_PASSWORD=$(cat $DB_PASSWORD_FILE) && \
    export QUERY_DB_PASSWORD=$(cat $QUERY_DB_PASSWORD_FILE) && \
    export SESSION_SECRET=$(cat $SESSION_SECRET_FILE) && \
    npm run start:prod