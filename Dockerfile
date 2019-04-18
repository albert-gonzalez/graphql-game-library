FROM keymetrics/pm2:latest-alpine

COPY . src/

# Install app dependencies
WORKDIR src
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# TypeScript
RUN npm run build:prod

EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
