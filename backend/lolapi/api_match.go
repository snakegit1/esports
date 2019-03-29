package lolapi

import (
	"encoding/json"
	"net/http"
	"github.com/yfix/esportsleague/backend/lolapi/matchstruct"
/*
	"fmt"
	"strconv"
	"strings"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	*/
)

func (c *APIClient) MatchData(matchId string) (*matchstruct.Match, error) {
	var req *http.Request
	req, err := c.genRequest("GET", "match", c.genURL([]string{"matches", matchId}), nil)
	if err != nil {
		return nil, err
	}
	data, err := c.do(req, true)
	var info matchstruct.Match
	err = json.Unmarshal(data, &info)
	if err != nil {
		return nil, err
	}
	return &info, nil
}

