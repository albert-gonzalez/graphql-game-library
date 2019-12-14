#!/bin/sh

npm run build
pm2-runtime start ecosystem.config.js
