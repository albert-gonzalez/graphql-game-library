FROM node:12-alpine

RUN apk update && \
    apk upgrade && \
    apk add git

COPY . src/frontend

# Install app dependencies
WORKDIR src/frontend
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]
