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

# Warn if git repo isn't clean.
#test -z "$(git status --porcelain)" || DIRTY=true
#if [[ "$DIRTY" = true ]]; then
#    echo "WARNING: You appear to have uncommitted changes in your repo."
#    echo "It is NOT recommended that you continue."
#    read -r -p "Cancel deploy? [Y/n] " response
#    case $response in
#	[nN])
#	    ;;
#	*)
#	    echo "deploy canceled by user."
#	    exit 1;
#	    ;;
#    esac
#fi

if [ ! -d "./dist" ]; then
  echo "Empty ./dist directory. You probably want to 'ln -s ../build ./dist'"
  exit 1;
fi

echo "Deploying PROJECT: yfix-esl-dev DEPLOYABLE: app.yaml"
gcloud app deploy app.yaml --project yfix-esl-dev --no-promote
