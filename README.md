# README #

Code repository for https://esportsleague.gg

# Architecture

### Frontend

The frontend client is a google appengine [service/module](https://cloud.google.com/appengine/docs/standard/go/an-overview-of-app-engine). It responds to all requests to esportsleague.gg that don't contain "*/api/v*" in the URL.

### Backend

The backend server is a google appengine [service/module](https://cloud.google.com/appengine/docs/standard/go/an-overview-of-app-engine). It responds to all requests to esportsleague.gg that DO contain "*/api/v*" in the URL.

# Services

### Authentication

We use authrocket for chat.

### Chat

The chat provider is hipchat. Hipchat has been deprecated by Atlassian in favor of Stride, so we were not able to create a test instance of the chatroom. Therefore we only create users in the production environment. The https://esportsleague.hipchat.com

### Mail

# Deploying

### Frontend

Before you begin, make sure that esportsleague/frontend/deploy has a dist folder symlinked to the build directory.

e.g. 
```
$ cd ~/code/esportsleague/frontend/deploy
$ ls -l
total 24
-rw-r--r--@ 1 cameron  staff   592 Sep 21 22:46 app.yaml
-rwxr-xr-x@ 1 cameron  staff  1053 Oct 15 00:32 deploy.sh

$ ln -s ../build ./dist'
$ ls -l
total 24
-rw-r--r--@ 1 cameron  staff   592 Sep 21 22:46 app.yaml
-rwxr-xr-x@ 1 cameron  staff  1053 Oct 15 00:32 deploy.sh
lrwxr-xr-x  1 cameron  staff     8 Oct 15 00:32 dist -> ../build
```


```
cd ~/code/esportsleague/frontend
yarn run deploy
```

You may need to go into the Google appengine console to update the 'live' version of `eleague-fe` service to the one you just uploaded.


### Backend

```
cd ~/code/esportsleague/backend/server
./deploy.sh
```

You may need to go into the Google appengine console to update the 'live' version of the `eleague-be` service to the one you just uploaded.

### Default module

## Chat
User signs up and an email is sent to brettmcdonald22@gmail.com 
You can change the email address this goes to, but it will require a code change. Probably easier just to set up an email filter to auto-forward it to whoever you want?

Login to hipchat - go to the users admin page:
https://esportsleague.hipchat.com/admin/users 
Find the user that just signed up. Click on them and “deactivate them”, then immediately re-activate them.
They will recieve an email allowing them to reset their password and login (THEY WILL NOT BE ABLE TO LOGIN UNTIL THEN - THIS IS A BUG WITH HIPCHAT - https://jira.atlassian.com/browse/HCPUB-3494 )
Person can sign into chat 

## Charging Users
- OSX: https://storage.googleapis.com/esl-admin-assets/charger-osx
- Windows: https://storage.googleapis.com/esl-admin-assets/charger-windows.exe

## Design

Template: https://storage.googleapis.com/esl-admin-assets/template.zip
