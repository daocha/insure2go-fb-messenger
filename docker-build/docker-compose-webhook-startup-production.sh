#!/bin/bash

basename="$(dirname $0)"
cd $basename
source ./envvars.txt

app_prefix=$SIFTWEBHOOK_APP_PREFIX

# remove existing containers and images
echo "[Stopping containers: $app_prefix*]"
docker stop $(docker ps -f name=$app_prefix -aq)

echo "[Removing containers: $app_prefix*]"
docker rm $(docker ps -f name=$app_prefix -aq)

echo "[Removing images: $app_prefix/*]"
docker rmi -f $(docker images $app_prefix\/* -aq)

# load all images
echo "[Loading all images $app_prefix*]"
./docker-all-images.sh load $app_prefix

# boot up containers
echo "[Docker-compose creating and starting containers]"
docker-compose -f ./docker-compose-webhook.yml \
  -f ./docker-compose-webhook-production-override.yml up -d --no-recreate
