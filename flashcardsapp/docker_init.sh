#!/bin/bash

cd /app

deploycmd=$(cat package.json | grep -Po '"deploy": ?"\K[^"]+')
if [[ ! -z "$deploycmd" ]]; then
  printf "\nYou have the deploy command in package.json: $deploycmd\n"
  printf "\nIn order to use 'npm run deploy' inside docker and deploy this app to aws s3 bucket, aws credentials
  must be in /.aws/credentials."
  id=$(cat .env | grep -Po "AWS_ACCESS_KEY_ID=\K[^\s]+")
  key=$(cat .env | grep -Po "AWS_SECRET_ACCESS_KEY=\K[^\s]+")
  region=$(cat .env | grep -Po "AWS_DEFAULT_REGION=\K[^\s]+")
  if [[ "$id" != "FOO" ]]; then
    if [[ ! -d "/root/.aws" ]]; then
      printf "\n /root/.aws dir does not exist in docker container, making it...\n"
      mkdir /root/.aws
    fi
    printf "\nWriting aws credentials found in .env to /root/.aws/credentials\n"
    touch /root/.aws/credentials
    echo "[default]" > /root/.aws/credentials
    echo "aws_access_key_id = $id" >> /root/.aws/credentials
    echo "aws_secret_access_key = $key" >> /root/.aws/credentials
    echo "region = $region" >> /root/.aws/credentials
    printf "\n\n\naws credentials are now in /root/.aws/credentials and will be used automatically "
    printf "when you run \nfrom inside docker:\n 'npm run build && npm run deploy'\n"
    printf "or from outside docker:\n"
    printf "docker exec -it app bash -c 'npm run build && npm run deploy'\n\n\n"
  else
    printf "\nInvalid aws credentials found in .env file, so you'll have to enter docker and add them manually to:\n"
    printf "/root/.aws/credentials"
  fi
else
  printf "\nNo 'deploy' command found in package.json, so not adding aws credentials from .env file\n"
fi

if [[ -d "node_modules" ]]; then
  rm -fr node_modules
fi
if [[ -f "package-lock.json" ]]; then
  rm package-lock.json
fi

#npm install
#npm audit fix
#npm run startdev
yarn install
yarn run startdev

