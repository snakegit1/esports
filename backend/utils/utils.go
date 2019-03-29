package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"google.golang.org/appengine/log"
)

const TimeZone = "America/Chicago"

type DateTimeData struct {
	MatchID   string    `json:"match_id"`
	MonthDate string    `json:"month_date"`
	FirstDate time.Time `json:"first_date"`
	LastDate  time.Time `json:"last_date"`
}

func FirstDayOfISOWeek(year int, week int, timezone *time.Location) time.Time {
	date := time.Date(year, 0, 0, 0, 0, 0, 0, timezone)
	isoYear, isoWeek := date.ISOWeek()
	for date.Weekday() != time.Monday { // iterate back to Monday
		date = date.AddDate(0, 0, -1)
		isoYear, isoWeek = date.ISOWeek()
	}
	for isoYear < year { // iterate forward to the first day of the first week
		date = date.AddDate(0, 0, 1)
		isoYear, isoWeek = date.ISOWeek()
	}
	for isoWeek < week { // iterate forward to the first day of the given week
		date = date.AddDate(0, 0, 1)
		isoYear, isoWeek = date.ISOWeek()
	}
	return date
}

func GenerateWeekDates(match_id, num_weeks int) (res []*DateTimeData) {
	loc, _ := time.LoadLocation(TimeZone)
	current_time := time.Now().In(loc)
	_, thisWeek := current_time.ISOWeek()
	for curr_week := thisWeek + 1; curr_week < thisWeek+num_weeks+1; curr_week++ {
		date := FirstDayOfISOWeek(current_time.Year(), curr_week, loc)
		last_weekday := date.AddDate(0, 0, 6)
		res = append(res, &DateTimeData{
			MatchID:   strconv.Itoa(match_id),
			MonthDate: fmt.Sprintf("%v/%v - %v/%v", int(date.Month()), date.Day(), int(last_weekday.Month()), last_weekday.Day()),
			FirstDate: date,
			LastDate:  last_weekday,
		})
		match_id++
	}
	return res
}

func nMulti(n int) int {
	result := 1

	for i := 1; i <= n; i++ {
		result *= n
	}

	return result
}

func CountMatches(n int) int {
	if n == 2 {
		return 1
	}
	result := nMulti(n) / nMulti(n-2) / 2
	return result
}

func RemoveItemAt(s []int, i int) []int {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}

func RemoveItem(s []int, item int) []int {
	index := FindIndex(s, item)
	return RemoveItemAt(s, index)
}

func FindIndex(s []int, item int) int {
	for index, v := range s {
		if v == item {
			return index
		}
	}
	return -1
}

func Log(ctx context.Context, object interface{}, title string) {
	v, _ := json.Marshal(object)
	log.Infof(ctx, "\n\n.................... %s .....................\n\n%s\n\n............", title, string(v))
}
