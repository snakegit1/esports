#VERSION=`date +%Y%m%d%H%M` #-`git rev-parse --short HEAD`
DIRTY=false
echo "Deploying Landing page: yfix-esl-dev DEPLOYABLE: app.yaml"
gcloud app deploy app.yaml --project yfix-esl-dev --no-promote
