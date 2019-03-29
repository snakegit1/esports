#!/bin/bash
#
# A generic script for deploying a nicely-versioned deployable to app engine.
#
# You should link your appcfg.py script to /usr/local/bin
# sudo ln -s ~/google-cloud-sdk/platform/google_appengine/appcfg.py /usr/local/bin/appcfg.py

set -o errexit
set -o nounset

#VERSION=`date +%Y%m%d%H%M` #-`git rev-parse --short HEAD`
DIRTY=false

if [ ! -d "./dist" ]; then
  echo "Empty ./dist directory. You probably want to 'ln -s ../build ./dist'"
  exit 1;
fi

echo "Deploying PROJECT: yfix-esl-dev DEPLOYABLE: app-default.yaml"
gcloud app deploy app-default.yaml --project yfix-esl-dev
