#!/bin/sh

rm -rf node_modules dist
npm install --production
npm run build:prod
pm2-runtime start ecosystem.config.js
