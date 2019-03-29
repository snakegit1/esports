#VERSION=`date +%Y%m%d` #-`git rev-parse --short HEAD`
DIRTY=false
echo "Deploying Landing page: sacred-catfish-180704 DEPLOYABLE: app.yaml"
gcloud app deploy app.yaml --project sacred-catfish-180704 --no-promote
