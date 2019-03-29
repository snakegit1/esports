package sheets

import (
	"bufio"
	"strings"

	"golang.org/x/net/context"
	"google.golang.org/appengine/urlfetch"
)

const AnnouncementsURL = "https://docs.google.com/spreadsheets/d/1x13RwZwXw8hhS3zPPj50blZCribTQkmZOGBYW7GHKXo/export?format=csv"

func ReadSpreadsheet(ctx context.Context, link string) ([]string, error) {
	client := urlfetch.Client(ctx)
	resp, err := client.Get(link)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	scanner := bufio.NewScanner(resp.Body)
	res := []string{}
	for scanner.Scan() {
		str := scanner.Text()
		if strings.HasPrefix(str, "\"") && strings.HasSuffix(str, "\"") {
			str = str[1 : len(str)-1]
		}
		res = append(res, str)
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return res, nil
}
