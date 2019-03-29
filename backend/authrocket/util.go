package authrocket

import (
	"io"
	"net/http"
	"strings"

	"github.com/yfix/esportsleague/backend/httputil"
)

func (c *Client) makeRequest(method, url string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("X-Authrocket-Api-Key", c.ApiKey)
	req.Header.Add("X-Authrocket-Realm", c.RealmID)

	return req, nil
}

func (c *Client) doPost(url string, body io.Reader, v interface{}) error {
	req, err := c.makeRequest(http.MethodPost, url, body)
	if err != nil {
		return err
	}
	vErr := authRocketValidationError{}
	return httputil.DoRequest(c.Context, c.HTTPClient, req, v, &vErr)
}

func (c *Client) doGet(url string, body io.Reader, v interface{}) error {
	req, err := c.makeRequest(http.MethodGet, url, body)
	if err != nil {
		return err
	}
	vErr := authRocketValidationError{}
	return httputil.DoRequest(c.Context, c.HTTPClient, req, v, &vErr)
}

type authRocketValidationError struct {
	Message string
	Errors  map[string][]string
}

func (a authRocketValidationError) IsEmpty() bool {
	return a.Message == "" || a.Error() == ""
}

func (a authRocketValidationError) Error() string {
	errors := []string{}
	for _, errs := range a.Errors {
		errors = append(errors, strings.Join(errs, "   "))
	}
	return strings.Join(errors, "   ")
}
