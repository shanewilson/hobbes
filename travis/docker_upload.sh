#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

if [ $DOCKER_IMAGE ]; then
  docker build -t $DOCKER_IMAGE .

  # If this is not a pull request, update the branch's docker tag.
  if [ $TRAVIS_PULL_REQUEST = 'false' ]; then
    docker tag $DOCKER_IMAGE quay.io/ncigdc/$DOCKER_IMAGE:${TRAVIS_BRANCH/\//-} \
      && docker push quay.io/ncigdc/$DOCKER_IMAGE:${TRAVIS_BRANCH/\//-};

    # If this commit has a tag, use on the registry too.
    if ! test -z $TRAVIS_TAG; then
      docker tag $DOCKER_IMAGE quay.io/ncigdc/$DOCKER_IMAGE:${TRAVIS_TAG} \
        && docker push quay.io/ncigdc/$DOCKER_IMAGE:${TRAVIS_TAG};
    fi
  fi
fi