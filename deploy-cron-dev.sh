#VERSION=`date +%Y%m%d` #-`git rev-parse --short HEAD`
gcloud app deploy --project yfix-esl-dev ./cron.yaml
