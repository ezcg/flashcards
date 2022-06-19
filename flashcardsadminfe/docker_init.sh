#!/bin/bash

#groupadd -g 1000 dockeruser && useradd -r -u 1000 -g dockeruser dockeruser
#cd /app
#chown -R dockeruser:dockeruser *
rm -fr node_modules
#npm install
#npm run-script startdev
yarn install
mkdir node_modules/.cache
chmod -R 777 node_modules/.cache
npm run-script startdev
