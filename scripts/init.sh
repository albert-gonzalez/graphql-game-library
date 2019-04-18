#!/bin/sh

rm -rf node_modules
npm install --production
pm2-runtime start ecosystem.config.js
