package lolapi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
//	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/net/context"
//	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
//	"google.golang.org/appengine/log"
)

/*
API End Points

BR	BR1       br1.api.riotgames.com
EUNE	EUN1  eun1.api.riotgames.com
EUW	EUW1      euw1.api.riotgames.com
JP	JP1       jp1.api.riotgames.com
KR	KR        kr.api.riotgames.com
LAN	LA1       la1.api.riotgames.com
LAS	LA2       la2.api.riotgames.com
NA	NA1, NA * na1.api.riotgames.com
OCE	OC1       oc1.api.riotgames.com
TR	TR1       tr1.api.riotgames.com
RU	RU        ru.api.riotgames.com
PBE	PBE1      pbe1.api.riotgames.com

API_URL_TOURNAMENT = 'https://americas.api.riotgames.com/lol/tournament/';
*/

// APIEndpoints mapping to api endpoints
var APIEndpoints = map[string]string{
	"br":   "br1.api.riotgames.com",
	"eune": "eun1.api.riotgames.com",
	"euw":  "euw1.api.riotgames.com",
	"kr":   "kr.api.riotgames.com",
	"lan":  "la1.api.riotgames.com",
	"las":  "la2.api.riotgames.com",
	"na":   "na1.api.riotgames.com",
	"oce":  "oc1.api.riotgames.com",
	"tr":   "tr1.api.riotgames.com",
	"ru":   "ru.api.riotgames.com",
	"jp":   "jp1.api.riotgames.com",
}

// ShardName a mapping of regions to shard names
var ShardName = map[string]string{
	"br":   "BR1",
	"eune": "EUN1",
	"euw":  "EUW1",
	"kr":   "KR",
	"lan":  "LA1",
	"las":  "LA2",
	"na":   "NA1",
	"oce":  "OC1",
	"tr":   "TR1",
	"ru":   "RU",
	"jp":   "JP1",
}

const (
	Version = "v3"
)

// RateLimit the current rate limit of the api
type RateLimit struct {
	LimitType            map[string]string // X-Rate-Limit-Type
	RetryAfter           int               // Retry-After
	AppRateLimitCount    map[string]int    // X-App-Rate-Limit-Count
	MethodRateLimitCount map[string]int    // X-Method-Rate-Limit-Count
	NextAttempt          time.Time
	Limits               map[string]string
}

// APIClient Riot API client
type APIClient struct {
	endpoint      string
	game          string
	region        string
	client        *http.Client
	totalRequests int
	key           string // API key
	tokens        chan struct{}
	RateLimit     *RateLimit
	shardName     string
}

// NewAPIClient create an initalized APIClient
/* previous client version
		client                      : &http.Client{
			Jar                     : nil,
			Timeout                 : time.Second * 5,
			Transport               : &http.Transport{
				Proxy               : http.ProxyFromEnvironment,
				Dial                : (&net.Dialer{
					Timeout         : 30 * time.Second,
					KeepAlive       : 30 * time.Second,
				}).Dial,
				TLSHandshakeTimeout : 10 * time.Second,
			}},
*/

func NewAPIClient(ctx context.Context, region, key string) *APIClient {
	c := &APIClient{
		key       : key,
		game      : "lol",
		region    : strings.ToLower(region),
		shardName : ShardName[strings.ToLower(region)],
		client    : &http.Client{Transport : &urlfetch.Transport{Context : ctx}},
		tokens    : make(chan struct{}, 20),
		RateLimit : &RateLimit{Limits : make(map[string]string)},
	}
	return c
}

func (c *APIClient) genURL(path []string) string {
	return strings.Join(path, "/")
}

func (c *APIClient) genStaticRequest(method, api string, query url.Values) (*http.Request, error) {
	u := url.URL{}
	u.Scheme = "https"
	u.Host = APIEndpoints[c.region]
	u.Path = fmt.Sprintf("/%s/static-data/%s/%s", c.game, Version, api)
	u.RawQuery = query.Encode()
	return http.NewRequest(method, u.String(), nil)
}

func (c *APIClient) genRequest(method, apiPart string, api string, query url.Values) (*http.Request, error) {
	u := url.URL{}
	u.Scheme = "https"
	u.Host = APIEndpoints[c.region]
	u.Path = fmt.Sprintf("/%s/%s/%s/%s", c.game, apiPart, Version, api)
	u.RawQuery = query.Encode()
	return http.NewRequest(method, u.String(), nil)
}

// do execute a request
func (c *APIClient) do(req *http.Request, apiKey bool) ([]byte, error) {
//    client := urlfetch.Client(ctx)
	// add api key

	// manipulate request
	if apiKey {
		query := req.URL.Query()
		query.Add("api_key", c.key)

		//rebuild request
		req.URL.RawQuery = query.Encode()
	}
	if c.RateLimit.RetryAfter > 0 {
		time.Sleep(time.Second * time.Duration(c.RateLimit.RetryAfter))
	}

	rc := make(chan struct {
		data []byte
		err  error
	})

		//ctx := appengine.NewContext(req)
//		client := http.Client{Transport: &urlfetch.Transport{Context:context.Background()}}
	go func(req http.Request) {
		defer func() {
			<-c.tokens
		}()

		// check for rate limiting
		// check retry limit
		// set a timer to wait for acceptable time

		if !time.Now().After(c.RateLimit.NextAttempt) {
			// Wait for the next attempt
			t := time.NewTimer(time.Since(c.RateLimit.NextAttempt))
			<-t.C
		}

		c.tokens <- struct{}{}
		resp, err := c.client.Do(&req)
		if err != nil {
			rc <- struct {
				data []byte
				err  error
			}{nil, err}
			log.Println(err)
			return
		}
		defer resp.Body.Close()

		// Update rate limiting
		// https://developer.riotgames.com/rate-limiting.html
		rl := resp.Header.Get("X-Rate-Limit-Count")
		if rl != "" {
			c.updateRateLimits(rl)
		}

		log.Println(resp.Header.Get("X-App-Rate-Limit-Count"))

		data, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			rc <- struct {
				data []byte
				err  error
			}{nil, err}
		}

		switch resp.StatusCode {
		case http.StatusTooManyRequests:

			//ra := resp.Header.Get("Retry-After")
			//c.RateLimit.NextAttempt = time.Now().Add(time.Second * time.Duration(ra))

		}

		if resp.StatusCode != http.StatusOK {
			rc <- struct {
				data []byte
				err  error
			}{nil, fmt.Errorf("API Error %s", string(data))}
		}

		rc <- struct {
			data []byte
			err  error
		}{data, err}

	}(*req)

	r := <-rc
	return r.data, r.err
}

func (c *APIClient) makeRequest(method, apiPart string, api string, query url.Values, auth bool, data interface{}) error {
	req, err := c.genRequest(method, apiPart, api, query)
	if err != nil {
		return err
	}

	respData, err := c.do(req, auth)
	if err != nil {
		return err
	}

	err = json.Unmarshal(respData, &data)
	if err != nil {
		return err
	}

	return err
}

func (c *APIClient) makeStaticRequest(method, apiPart string, api string, query url.Values, auth bool, data interface{}) error {
	req, err := c.genRequest(method, apiPart, api, query)
	if err != nil {
		return err
	}

	respData, err := c.do(req, auth)
	if err != nil {
		return err
	}

	err = json.Unmarshal(respData, &data)
	if err != nil {
		return err
	}

	return err
}

