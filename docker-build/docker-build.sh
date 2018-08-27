#!/bin/bash

build() {
  local basename="$(dirname $0)"
  cd $basename
  source envvars.txt

  local app=$1
  local app_version=$2
  local app_image_name="$SIFTCHATBOT_APP_PREFIX/$1"


  docker build -f ../composer-rest-server/Dockerfile \
    -t $app_image_name:$app_version ../
}

if [ "$1" = "" ] || [ "$2" = ""  ]; then
    echo "Usage: docker-build.sh [app_name] [version_num]"
else
    build $1 $2
fi
