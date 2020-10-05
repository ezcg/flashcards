#!/bin/bash

#groupadd -g 1000 dockeruser && useradd -r -u 1000 -g dockeruser dockeruser
#cd /app
#chown -R dockeruser:dockeruser *
npm install
npm run-script startdev
