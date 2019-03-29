package httputil

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type parsedError interface {
	error
	IsEmpty() bool
}

func DoRequest(ctx context.Context, client *http.Client, req *http.Request, v interface{}, errV parsedError) error {
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		log.Warningf(ctx, "unexpected status code: %d", resp.StatusCode)
		log.Infof(ctx, "resp body: %s", data)
		if errV != nil {
			if parseErr := parseErrorStruct(ctx, data, errV); parseErr == nil {
				return errV
			}
		}
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	if err != nil {
		return err
	}
	if v != nil {
		err = json.Unmarshal(data, v)
	}

	return err
}

func MarshalBody(v interface{}) (io.Reader, error) {
	data, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	return strings.NewReader(string(data)), nil
}

func parseErrorStruct(ctx context.Context, data []byte, v parsedError) error {
	if err := json.Unmarshal(data, v); err != nil || v.IsEmpty() {
		log.Warningf(ctx, "httputil.parseErrorStruct cannot marshal error message: %v\nbody: %s", err, data)
		return fmt.Errorf("cannot parse error struct")
	}
	return nil
}
