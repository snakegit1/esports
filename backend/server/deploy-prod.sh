#VERSION=`date +%Y%m%d%H%M` #-`git rev-parse --short HEAD`
gcloud app deploy --project sacred-catfish-180704 ./app.yaml --no-promote
