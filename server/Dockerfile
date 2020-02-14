FROM keymetrics/pm2:12-alpine

RUN apk update && \
    apk upgrade && \
    apk add git

COPY . src/server

# Install app dependencies
WORKDIR src/server
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

# TypeScript
RUN npm run build:prod

EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
