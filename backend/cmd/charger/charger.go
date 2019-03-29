package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
/*
	"bitbucket.org/ctangney/esportsleague/backend"
	"bitbucket.org/ctangney/esportsleague/backend/datastore"
*/
	"github.com/yfix/esportsleague/backend"
	"github.com/yfix/esportsleague/backend/datastore"

	"golang.org/x/crypto/ssh/terminal"
)

const (
	PROD_URL    = "https://esportsleague.gg/api/v1"
	STAGING_URL = "https://eleague-fe-dot-sacred-catfish-180704.appspot.com/api/v1"
	DEV_URL     = "http://localhost:9000/api/v1"
)

var (
	env = flag.String("env", "prod", "Environment to use (prod, staging, dev)")
	url = PROD_URL
)

func main() {
	flag.Parse()

	switch *env {
	case "staging":
		url = STAGING_URL
	case "dev":
		url = DEV_URL
	}

	email, password := readCredentials()
	token := login(email, password)

	profiles, err := getAllProfiles(token)
	exitIf(err)

	chargeAll(token, profiles)

	fmt.Println("Goodbye")
}

func readCredentials() (string, string) {
	fmt.Println("You must login...")
	email := readInput("Email: \n> ")

	fmt.Printf("Password: \n> ")
	pwd, err := terminal.ReadPassword(int(os.Stdin.Fd()))
	exitIf(err)

	fmt.Println(" ")

	return email, string(pwd)
}

func login(email, password string) string {
	req := backend.AuthMessage{
		Email:    email,
		Password: password,
	}
	res := backend.AuthResponse{}

	err := sendRequest(url+"/user/login", req, &res)
	exitIf(err)

	return res.Token
}

func getAllProfiles(token string) ([]*datastore.Profile, error) {
	req := backend.PageMessage{
		Token:  token,
		Limit:  1000,
		Offset: 0,
	}
	res := backend.ProfilesMessage{}
	err := sendRequest(url+"/profiles-get", req, &res)
	return res.Profiles, err
}

func chargeAll(token string, profiles []*datastore.Profile) {
	input := readInput("How many dollars should each user be charged?  (e.g. 25.00) \n> ")

	dollarsF, err := strconv.ParseFloat(input, 64)
	exitIf(err)
	cents := uint64(dollarsF * 100)

	input = readInput("Each user will be charged $%.2f dollars. Press <enter> to continue.\n> ", dollarsF)

	for _, p := range profiles {
		if p.StripeCustomerID == "" {
			fmt.Printf("Skipping user without stripe customer id: %s (%s)", p.UserID, p.InGameName)
		}
		input = readInput("user %s (%s). <ENTER> to charge or <S> to skip: ", p.UserID, p.InGameName)
		if strings.HasPrefix(strings.ToLower(input), "s") {
			fmt.Println("Skipped.")
			continue
		}

		err := chargeUser(token, p, cents)
		if err != nil {
			fmt.Printf("\n\nThere was an error charging this user: %v\n\n", err)
		} else {
			fmt.Println("Successfully charged user.")
		}
	}
}

func chargeUser(token string, profile *datastore.Profile, cents uint64) error {
	req := backend.ChargeCustomerMessage{
		Token:       token,
		AmountCents: cents,
		UserID:      profile.UserID,
	}
	res := backend.EmptyMessage{}
	err := sendRequest(url+"/payment-charge", req, &res)
	return err
}

func sendRequest(url string, req interface{}, res interface{}) error {
	data, err := json.Marshal(req)
	exitIf(err)

	log.Println("Sending request to:", url)
	hReq, err := http.NewRequest(http.MethodPost, url, strings.NewReader(string(data)))
	if err != nil {
		return err
	}

	hResp, err := http.DefaultClient.Do(hReq)
	if err != nil {
		return err
	}
	defer hResp.Body.Close()

	if hResp.StatusCode != 200 {
		return fmt.Errorf("bad status code: %d", hResp.StatusCode)
	}

	data, err = ioutil.ReadAll(hResp.Body)
	exitIf(err)

	wrappedRes := struct {
		Data  json.RawMessage
		Error string
	}{}
	if err = json.Unmarshal(data, &wrappedRes); err != nil {
		return err
	}

	if wrappedRes.Error != "" {
		return fmt.Errorf("%s", wrappedRes.Error)
	}

	return json.Unmarshal(wrappedRes.Data, res)
}

func readInput(fmtString string, args ...interface{}) string {
	fmt.Printf(fmtString, args...)
	var input string
	_, err := fmt.Scanln(&input)
	if err != nil && err.Error() != "unexpected newline" {
		exitIf(err)
	}
	return input
}

func exitIf(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}
