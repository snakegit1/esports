#VERSION=`date +%Y%m%d%H%M` #-`git rev-parse --short HEAD`
gcloud app deploy --project yfix-esl-dev ./app.yaml --no-promote
