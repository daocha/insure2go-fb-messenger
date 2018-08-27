#!/bin/bash

help() {
    echo "\
Usage: $0 save    - save all docker images to current directory
       $0 load    - find all images in current directory then import to docker"
    exit 1
}

get-image-field() {
  local imageId=$1
  local field=$2
  : ${imageId:? required}
  : ${field:? required}

  docker images --no-trunc|sed -n "/${imageId}/ s/ \+/ /gp"|cut -d" " -f $field | head -n1
}

get-image-name() {
  get-image-field $1 1
}

get-image-tag() {
  get-image-field $1 2
}

save-all-image() {
  local folder
  if [ "$1" = "" ]; then
    folder="."
  else
    folder=$1
    mkdir -p $folder
  fi

  local ids=$(docker images siftchatbot\/* -aq)
  local name safename tag

  for id in $ids; do
    name=$(get-image-name $id)
    tag=$(get-image-tag $id)
    if [[  $name =~ / ]] ; then
       dir="$folder/${name%/*}"
       mkdir -p $dir
    fi
    echo [DEBUG] save $name:$tag ...
    (time  docker save -o "$folder/$name.$tag.dim" $name:$tag) 2>&1|grep real
  done
}

load-all-image() {
  local folder
  if [ "$1" = "" ]; then
    folder="."
  else
    folder=$1
  fi
  local name safename noextension tag

  for image in $(find $folder -name \*.dim); do
    echo [DEBUG] load
    tar -Oxf $image repositories
    echo
    docker load -i "$image"
  done
}

# ---------------------------------------------

case $1 in
    # -- save --
    save)
        save-all-image $2
    ;;
    # -- load --
    load)
        load-all-image $2
    ;;
    # -- others --
    *)
        help
    ;;
esac

exit 0
