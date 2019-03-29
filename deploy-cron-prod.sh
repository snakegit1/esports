#VERSION=`date +%Y%m%d` #-`git rev-parse --short HEAD`
gcloud app deploy --project sacred-catfish-180704 ./cron.yaml
