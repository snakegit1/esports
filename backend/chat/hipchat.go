package chat

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	/*
		"bitbucket.org/ctangney/esportsleague/backend/constants"
		"bitbucket.org/ctangney/esportsleague/backend/httputil"
	*/
	"github.com/yfix/esportsleague/backend/constants"
	"github.com/yfix/esportsleague/backend/httputil"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/mail"
	"google.golang.org/appengine/urlfetch"
)

const hipChatURLPrefix = "https://api.hipchat.com"

type CreateUserResponse struct {
	// Lots of ish
	Password string `json:"password"`
}

func CreateUser(ctx context.Context, inGameName, email string) (password string, err error) {
	url := hipChatURLPrefix + "/v2/user"
	req, err := createHipchatRequest(ctx, url, http.MethodPost, map[string]interface{}{
		"name":  inGameName,
		"email": email,
	})
	if err != nil {
		return "", err
	}

	// If this is staging, return early.

	client := urlfetch.Client(ctx)
	res := CreateUserResponse{}
	if err := httputil.DoRequest(ctx, client, req, &res, nil); err != nil {
		return "", err
	}

	if err = sendActivationEmail(ctx, inGameName, email); err != nil {
		log.Errorf(ctx, "error sending email: %v", err)
	}

	return res.Password, nil
}

// func DeactivateUser(ctx context.Context, email string) error {
// 	url := hipChatURLPrefix + "/v2/user/" + email

// 	req, err := createHipchatRequest(ctx, url, http.MethodDelete, nil)
// 	if err != nil {
// 		return err
// 	}

// 	client := urlfetch.Client(ctx)
// 	if err = httputil.DoRequest(ctx, client, req, nil, nil); err != nil {
// 		// Just log the error here.
// 		log.Errorf(ctx, "error deactivating user: %v", err)
// 	}

// 	if err = sendActivationEmail(ctx, email); err != nil {
// 		log.Errorf(ctx, "error sending email: %v", err)
// 	}
// 	return nil
// }

func createHipchatRequest(ctx context.Context, url, method string, req interface{}) (*http.Request, error) {
	var body *strings.Reader = nil
	if req != nil {
		data, err := json.Marshal(req)
		if err != nil {
			return nil, err
		}
		body = strings.NewReader(string(data))
	}

	hReq, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	config := constants.GetConfig(ctx)
	hReq.Header.Add("Authorization", "Bearer "+config.HipChatAdminToken)
	hReq.Header.Add("Content-Type", "application/json")
	return hReq, nil
}

func sendActivationEmail(ctx context.Context, inGameName, email string) error {
	config := constants.GetConfig(ctx)

	appID := appengine.AppID(ctx)
	msg := &mail.Message{
		Sender:  "esportsleague-gg bot <bot@" + appID + ".appspotmail.com>",
		To:      []string{config.EmailNotificationTo, "cameront+ealhardcoded@gmail.com"},
		Subject: "New User needs to be activated in hipchat",
		Body:    fmt.Sprintf("User name: %s email: %s needs to be de-activated/reactivated at: %s", inGameName, email, "https://esportsleague.hipchat.com/admin/users"),
	}
	err := mail.Send(ctx, msg)
	if err != nil {
		log.Errorf(ctx, "couldn't send email: %v", err)
	}
	return err
}
