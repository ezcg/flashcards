#!/bin/bash

printf "\n\n*************** RUNNING docker_init.sh for be\n\n"

touch ~/.bashrc
echo "alias ll='ls -ltra'" > ~/.bashrc
npm install
npm audit fix
npm run-script startdev

