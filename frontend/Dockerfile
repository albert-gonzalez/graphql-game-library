FROM node:12

COPY . src/

# Install app dependencies
WORKDIR src
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]
