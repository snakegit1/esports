package authrocket

import (
	"fmt"
	"net/http"
	"strings"

	/*
		"bitbucket.org/ctangney/esportsleague/backend/constants"
		"bitbucket.org/ctangney/esportsleague/backend/httputil"
	*/
	"github.com/yfix/esportsleague/backend/constants"
	"github.com/yfix/esportsleague/backend/httputil"
	"github.com/yfix/esportsleague/backend/utils"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/urlfetch"
)

const (
	apiURLSuffix = ".authrocket.com/v1/"
)

func New(ctx context.Context) *Client {
	httpClient := urlfetch.Client(ctx)
	cfg := constants.GetConfig(ctx)

	return &Client{
		Context:    ctx,
		HTTPClient: httpClient,
		Subdomain:  cfg.AuthRocketSubdomain,
		ApiKey:     cfg.AuthRocketAPIKey,
		RealmID:    cfg.AuthRocketRealmID,
	}
}

type Client struct {
	Context    context.Context
	HTTPClient *http.Client
	Subdomain  string
	ApiKey     string
	RealmID    string
}

func (c *Client) url(endpoint string) string {
	endpoint = strings.TrimPrefix(endpoint, "/")
	return "https://" + c.Subdomain + apiURLSuffix + endpoint
}

type ClientRequest struct {
	IP     string `json:"ip"`
	Client string `json:"client"`
}

type AuthenticateRequest struct {
	Username string        `json:"-"`
	Password string        `json:"password"`
	Request  ClientRequest `json:"request"`
}

type AuthenticateResponse struct {
	User
	Token string `json:"token"`
}

func (c *Client) Authenticate(req AuthenticateRequest) (AuthenticateResponse, error) {
	suffix := "users/" + req.Username + "/authenticate?expand=memberships"
	res := AuthenticateResponse{}
	body, err := httputil.MarshalBody(req)
	if err != nil {
		return res, err
	}
	if err = c.doPost(c.url(suffix), body, &res); err != nil {
		if err.Error() == "unexpected status code: 404" {
			err = fmt.Errorf("Invalid username/password")
		}
	}
	log.Infof(c.Context, "authRocket.Authenticate RES: %+v, ERR:%v", res, err)
	return res, err
}

type CreateRequest struct {
	User User `json:"user"`
}

func (c *Client) Create(req CreateRequest) (AuthenticateResponse, error) {
	suffix := "users"
	req.User.RealmID = c.RealmID
	res := AuthenticateResponse{}
	body, err := httputil.MarshalBody(req)
	if err != nil {
		return res, err
	}
	err = c.doPost(c.url(suffix), body, &res)
	log.Infof(c.Context, "authrocket.Create RES: %v, ERR:%v", res, err)
	return res, err
}

type SessionResponse struct {
	ID           string  `json:"id"`
	UserID       string  `json:"user_id"`
	Object       string  `json:"object"`
	CreatedAtSec float64 `json:"created_at"`
	ExpiresAtSec float64 `json:"expires_at"`
	User         User    `json:"user"`
}

func (c *Client) VerifySession(token string) (SessionResponse, error) {
	suffix := "sessions/" + token + "?expand=memberships"
	res := SessionResponse{}
	err := c.doGet(c.url(suffix), nil, &res)
	log.Infof(c.Context, "authrocket.ValidateSession RES: %v, ERR: %v", res, err)
	return res, err
}

type ResetResponse struct {
	ID       string `json:"id"`
	RealmID  string `json:"realm_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Object   string `json:"object"`
	Token    string `json:"token"`
}

func (c *Client) ResetPassword(email string) (ResetResponse, error) {
	suffix := "users/" + email + "/generate_password_token"
	res := ResetResponse{}
	err := c.doPost(c.url(suffix), nil, &res)
	log.Infof(c.Context, "authrocket.ResetPassword RES: %v, ERR: %v", res, err)
	return res, err
}

type User struct {
	ID                string                 `json:"id"`
	RealmID           string                 `json:"realm_id"`
	Username          string                 `json:"username"`
	Password          string                 `json:"password"`
	State             string                 `json:"state"`
	UserType          string                 `json:"user_type"`
	Reference         interface{}            `json:"reference"`
	Custom            map[string]interface{} `json:"custom"`
	Name              string                 `json:"name"`
	Email             string                 `json:"email"`
	EmailVerification string                 `json:"email_verification"`
	Object            string                 `json:"object"`
	LastLoginAt       float64                `json:"last_login_at"`
	CreatedAt         float64                `json:"created_at"`
	FirstName         string                 `json:"first_name"`
	LastName          string                 `json:"last_name"`
	MembershipCount   int64                  `json:"membership_count"`
	Memberships       []Membership           `json:"memberships"`
	Credentials       []map[string]string    `json:"credentials"`
}

func (u *User) IsAdmin() bool {
	for _, m := range u.Memberships {
		for _, p := range m.Permissions {
			if p == "admins" {
				return true
			}
		}
	}
	return false
}

type UsersList struct {
	Collection []*User `json:"collection"`
}

func (c *Client) GetUsersList() (UsersList, error) {
	suffix := "users"
	res := UsersList{}
	utils.Log(c.Context, c.url(suffix), "URL")
	err := c.doGet(c.url(suffix), nil, &res)
	return res, err
}

type Membership struct {
	ID          string   `json:"id"`
	Object      string   `json:"object"`
	Permissions []string `json:"permissions"`
	UserID      string   `json:"user_id"`
	// Custom map[string]interface{}{}
	// ExpiresAt
	// OrgID
}
