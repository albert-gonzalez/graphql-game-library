#!/bin/sh

npm install
npm run build:prod
pm2-runtime start ecosystem.config.js
