package schedule

import (
	"fmt"
	"sort"
	"strconv"
	"time"

	"github.com/yfix/esportsleague/backend/datastore"
	"github.com/yfix/esportsleague/backend/match"
	"github.com/yfix/esportsleague/backend/utils"

	//	"github.com/yfix/esportsleague/backend/lolapi"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type ScheduleMatches struct {
	ID         string   `json:"id"`
	TeamID     string   `json:"team_id"`
	Opponent   string   `json:"opponent"`
	MatchID    string   `json:"match_id"`
	Dates      string   `json:"dates"`
	MatchDates string   `json:"match_dates"`
	Scheduled  []string `json:"date_time"`
}

func GetUserScheduledMatches(ctx context.Context, UserID string) (res []*ScheduleMatches, err error) {
	log.Infof(ctx, "schedule.GetSchedules: get user schedules")
	//	lolapi.GetStaticChampion(ctx)
	var schedules []*datastore.ScheduleUserToMatches
	// -------------------------get matches block ----------------------------------------------------
	matches, err := match.GetMatchesUserID(ctx, UserID)
	if err != nil {
		log.Warningf(ctx, "schedule.GetMatchesUserID: empty matches data: %v", err)
		return nil, fmt.Errorf("empty matches data: %v", err)
	}
	// ---------------------------------------------------
	teams, err := datastore.GetTeamsByUserID(ctx, UserID)
	if len(teams) < 1 {
		return nil, fmt.Errorf("Not team member")
	}
	team_data := &datastore.Team{}
	for i := range teams {
		if team_data.ID == "" {
			team_data = teams[i]
		}
	}
	div_teams, err := datastore.GetDivisionTeams(ctx, team_data.Division)
	if err != nil {
		log.Warningf(ctx, "GetDivisionTeams catch error: %v", err)
	}

	// --------------------------------------------------
	schedules, err = datastore.GetSchedulesByUID(ctx, UserID)
	res = []*ScheduleMatches{}
	if err != nil {
		log.Warningf(ctx, "datastore.GetUserSchedules: empty data: %v", err)
	}
	opponent := ""
	for _, data := range matches {
		if data.Side1 == team_data.ID {
			for _, d := range div_teams {
				if data.Side2 == d.ID {
					opponent = d.Name
				}
			}
		} else if data.Side2 == team_data.ID {
			for _, d := range div_teams {
				if data.Side1 == d.ID {
					opponent = d.Name
				}
			}
		} else {
			opponent = "Not Yet Selected"
		}
		tmp := &ScheduleMatches{
			ID:         data.ID,
			TeamID:     team_data.ID,
			Opponent:   opponent,
			MatchID:    data.MatchID,
			Dates:      fmt.Sprintf("%v/%v - %v/%v", int(data.FirstDate.Month()), data.FirstDate.Day(), int(data.LastDate.Month()), data.LastDate.Day()),
			MatchDates: data.Scheduled,
			Scheduled:  []string{},
		}
		selected_date := ""
		if len(schedules) > 0 {
			for _, p := range schedules {
				if data.ID == p.ID {
					if data.Scheduled == "" {
						selected_date, err = CheckScheduleMatchReady(ctx, data.ID)
					} else {
						selected_date = data.Scheduled
					}
					tmp = &ScheduleMatches{
						ID:         data.ID,
						TeamID:     team_data.ID,
						Opponent:   opponent,
						MatchID:    data.MatchID,
						Dates:      fmt.Sprintf("%v/%v - %v/%v", int(data.FirstDate.Month()), data.FirstDate.Day(), int(data.LastDate.Month()), data.LastDate.Day()),
						MatchDates: selected_date,
						Scheduled:  p.DateTime,
					}
				}
			}
		}
		//		log.Infof(ctx, "schedule.GetMatchesUserID: match is: %#v", data)
		res = append(res, tmp)
	}
	GetFirstUnscheduledMatch(ctx, UserID)
	return res, nil
}

type WeekdaySchedules struct {
	Weekday string
	Count   int
}

func NumSelectedMatchDates(ctx context.Context, MatchID string) (selected_day string, err error) {
	log.Infof(ctx, "schedule.NumSelectedMatchDates: id: %v", MatchID)
	schedules, err := datastore.GetSchedulesByMatch(ctx, MatchID)
	if err != nil {
		log.Warningf(ctx, "Schedules.NumSelectedMatchDates: empty data: %+v", err)
		return "", err
	}
	mon, tue, wed, thu, fri, sat, sat2 := 0, 0, 0, 0, 0, 0, 0
	team2_mon, team2_tue, team2_wed, team2_thu, team2_fri, team2_sat, team2_sat2 := 0, 0, 0, 0, 0, 0, 0
	Team1 := ""
	for _, v := range schedules {
		if Team1 == "" {
			Team1 = v.TeamID
		}
		if Team1 == v.TeamID {
			for _, val := range v.DateTime {
				if val == "Monday 6pm PT" {
					mon++
				}
				if val == "Tuesday 6pm PT" {
					tue++
				}
				if val == "Wednesday 6pm PT" {
					wed++
				}
				if val == "Thursday 6pm PT" {
					thu++
				}
				if val == "Friday 6pm PT" {
					fri++
				}
				if val == "Saturday 11am PT" {
					sat++
				}
				if val == "Saturday 1pm PT" {
					sat2++
				}
			}
		} else {
			for _, val := range v.DateTime {
				if val == "Monday 6pm PT" {
					team2_mon++
				}
				if val == "Tuesday 6pm PT" {
					team2_tue++
				}
				if val == "Wednesday 6pm PT" {
					team2_wed++
				}
				if val == "Thursday 6pm PT" {
					team2_thu++
				}
				if val == "Friday 6pm PT" {
					team2_fri++
				}
				if val == "Saturday 11am PT" {
					team2_sat++
				}
				if val == "Saturday 1pm PT" {
					team2_sat2++
				}
			}
		}
	}
	Team1_days := []*WeekdaySchedules{}
	Team2_days := []*WeekdaySchedules{}

	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Monday 6pm PT", Count: mon})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Tuesday 6pm PT", Count: tue})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Wednesday 6pm PT", Count: wed})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Thursday 6pm PT", Count: thu})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Friday 6pm PT", Count: fri})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Saturday 11am PT", Count: sat})
	Team1_days = append(Team1_days, &WeekdaySchedules{Weekday: "Saturday 1pm PT", Count: sat2})

	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Monday 6pm PT", Count: team2_mon})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Tuesday 6pm PT", Count: team2_tue})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Wednesday 6pm PT", Count: team2_wed})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Thursday 6pm PT", Count: team2_thu})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Friday 6pm PT", Count: team2_fri})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Saturday 11am PT", Count: team2_sat})
	Team2_days = append(Team2_days, &WeekdaySchedules{Weekday: "Saturday 1pm PT", Count: team2_sat2})

	sort.Slice(Team1_days, func(i, j int) bool { return Team1_days[i].Count > Team1_days[j].Count })
	sort.Slice(Team2_days, func(i, j int) bool { return Team2_days[i].Count > Team2_days[j].Count })

	max_matches := make(map[string]int)
	//	best_matches := make(map[string]int)
	for _, k := range Team1_days {
		//		if k.Count < 1 { continue }
		for _, v := range Team2_days {
			//			if v.Count < 1 { continue }
			if k.Weekday == v.Weekday {
				max_matches[k.Weekday] = k.Count + v.Count
			}
			/*
				if k.Count == v.Count && k.Weekday == v.Weekday {
					best_matches[k.Weekday] = k.Count + v.Count
				}
			*/
		}
	}
	max_matches_sort := rankByDaysCount(max_matches)
	//	best_matches_sort := rankByDaysCount(best_matches)
	max := 0
	for _, e := range max_matches_sort {
		if e.Value > max {
			max = e.Value
		}
	}
	for _, val := range max_matches_sort {
		selected_day = val.Key
		break
	}
	if max_matches["Monday 6pm PT"] == max {
		selected_day = "Monday 6pm PT"
	}
	if selected_day == "" {
		selected_day = "Monday 6pm PT"
	}
	//	log.Infof(ctx, "schedule.NumSelectedMatchDates: max_matches: %#v, best_matches: %#v", max_matches_sort, best_matches_sort)
	log.Infof(ctx, "schedule.NumSelectedMatchDates: selected day is: %v", selected_day)
	return selected_day, nil
}

func rankByDaysCount(dayFrequencies map[string]int) PairList {
	pl := make(PairList, len(dayFrequencies))
	i := 0
	for k, v := range dayFrequencies {
		pl[i] = Pair{k, v}
		i++
	}
	sort.Sort(sort.Reverse(pl))
	return pl
}

type Pair struct {
	Key   string
	Value int
}

type PairList []Pair

func (p PairList) Len() int           { return len(p) }
func (p PairList) Less(i, j int) bool { return p[i].Value < p[j].Value }
func (p PairList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

func CheckScheduleMatchReady(ctx context.Context, MatchID string) (selected_day string, err error) {
	match_data, err := datastore.GetMatchFilter(ctx, &datastore.Match{ID: MatchID})
	if err != nil {
		log.Warningf(ctx, "Schedules.CheckScheduleMatchReady: empty data: %v", err)
		return "", err
	}
	curr_match := &datastore.Match{}
	for _, data := range match_data {
		if data.ID != MatchID {
			continue
		}
		curr_match = data
	}
	num_players1, err := datastore.GetNumTeamPlayers(ctx, curr_match.Side1)
	if err != nil {
		log.Warningf(ctx, "Schedules.CheckScheduleMatchReady: error get num team 1 players: %v", err)
		return "", err
	}
	if err != nil {
		log.Warningf(ctx, "Schedules.CheckScheduleMatchReady: error get num team 2 players: %v", err)
		return "", err
	}
	num_players2, err := datastore.GetNumTeamPlayers(ctx, curr_match.Side2)
	count_players := num_players1 + num_players2
	num_schedules, err := datastore.GetNumSchedules(ctx, curr_match.ID)
	if err != nil {
		log.Warningf(ctx, "Schedules.CheckScheduleMatchReady: error get match num schedules: %v", err)
		return "", err
	}
	log.Infof(ctx, "Schedules.CheckScheduleMatchReady: team1 num players is: %d, team2 num players is: %d, total schedules records is: %d", num_players1, num_players2, num_schedules)
	if num_schedules < count_players {
		log.Infof(ctx, "Schedules.CheckScheduleMatchReady: not all team players set match schedules")
		return "", err
	}
	selected_day, err = NumSelectedMatchDates(ctx, curr_match.ID)
	if err != nil {
		log.Warningf(ctx, "Schedules.CheckScheduleMatchReady: error get match num schedules: %v", err)
		return "", err
	}
	if selected_day != "" {
		update_query := &datastore.Match{
			ID:        curr_match.ID,
			MatchID:   curr_match.MatchID,
			Division:  curr_match.Division,
			Region:    curr_match.Region,
			Side1:     curr_match.Side1,
			Side2:     curr_match.Side2,
			FirstDate: curr_match.FirstDate,
			LastDate:  curr_match.LastDate,
			Played:    0,
			Scheduled: selected_day,
		}
		datastore.SetMatches(ctx, update_query)
	}
	return selected_day, nil
}

func GetFirstUnscheduledMatch(ctx context.Context, UserID string) (res *ScheduleMatches, err error) {
	teams, err := datastore.GetTeamsByUserID(ctx, UserID)
	if len(teams) < 1 {
		return nil, fmt.Errorf("Not team member")
	}
	team_data := &datastore.Team{}
	for i := range teams {
		if team_data.ID == "" {
			team_data = teams[i]
		}
	}
	matches, err := match.GetMatchesUserID(ctx, UserID)
	if err != nil {
		log.Warningf(ctx, "schedule.GetMatchesUserID: empty matches data: %v", err)
		return nil, fmt.Errorf("empty matches data: %v", err)
	}
	div_teams, err := datastore.GetDivisionTeams(ctx, team_data.Division)
	if err != nil {
		log.Warningf(ctx, "GetDivisionTeams catch error: %v", err)
	}
	opponent := ""
	sort.Slice(matches, func(i, j int) bool {
		left, _ := strconv.Atoi(matches[i].MatchID)
		right, _ := strconv.Atoi(matches[j].MatchID)
		return left <= right
	})
	for _, data := range matches {
		if data.Side1 != team_data.ID && data.Side2 == team_data.ID {
			continue
		}
		log.Infof(ctx, "current match is: %#v", data)
		if data.Side1 == team_data.ID {
			for _, d := range div_teams {
				if data.Side2 == d.ID {
					opponent = d.Name
				}
			}
		} else if data.Side2 == team_data.ID {
			for _, d := range div_teams {
				if data.Side1 == d.ID {
					opponent = d.Name
				}
			}
		}
		match_scheduled := datastore.CheckIsScheduled(ctx, data.ID, UserID)
		if match_scheduled == false {
			res = &ScheduleMatches{
				ID:         data.ID,
				TeamID:     team_data.ID,
				Opponent:   opponent,
				MatchID:    data.MatchID,
				Dates:      fmt.Sprintf("%v/%v - %v/%v", int(data.FirstDate.Month()), data.FirstDate.Day(), int(data.LastDate.Month()), data.LastDate.Day()),
				MatchDates: data.Scheduled,
				Scheduled:  []string{},
			}
			break
		}
	}
	return res, nil
}

func MatchScheduleCurrWeek(ctx context.Context) {
	loc, _ := time.LoadLocation(utils.TimeZone)
	current_time := time.Now().In(loc)
	_, thisWeek := current_time.ISOWeek()
	curr_week := thisWeek + 1
	date := utils.FirstDayOfISOWeek(current_time.Year(), curr_week, loc)
	next_weekday := date.AddDate(0, 0, 6)
	log.Infof(ctx, "selected week is %v/%v - %v/%v start time is: %v:%v", int(current_time.Month()), current_time.Day(), int(next_weekday.Month()), next_weekday.Day(), current_time.Hour(), current_time.Minute())
	matches, _ := datastore.GetCurrWeekMatches(ctx, &datastore.Match{
		FirstDate: date,
		LastDate:  next_weekday,
		Played:    0,
	})
	utils.Log(ctx, matches, "Current Week Matches")
	if len(matches) > 0 {
		log.Infof(ctx, "schedule.MatchScheduleCurrWeek: working!")
		for _, data := range matches {
			if data.Scheduled != "" {
				continue
			}
			if data.FirstDate.Before(current_time) || data.FirstDate.After(next_weekday) {
				//				log.Infof(ctx, "match.MatchScheduleCurrWeek: next week match is: %#v", data)
				continue
			}
			log.Infof(ctx, "Selected ID is %v, dates - %v/%v - %v/%v time is: %v:%v", data.ID, int(data.FirstDate.Month()), data.FirstDate.Day(), int(data.LastDate.Month()), data.LastDate.Day(), data.FirstDate.Hour(), data.FirstDate.Minute())
			selected_day, err := NumSelectedMatchDates(ctx, data.ID)
			if err != nil {
				log.Warningf(ctx, "Schedules.MatchScheduleCurrWeek: error get match selected day: %v", err)
				return
			}
			if selected_day != "" {
				log.Infof(ctx, "Schedules.MatchScheduleCurrWeek: selected day %v", selected_day)
				update_query := &datastore.Match{
					ID:        data.ID,
					MatchID:   data.MatchID,
					Division:  data.Division,
					Region:    data.Region,
					Side1:     data.Side1,
					Side2:     data.Side2,
					FirstDate: data.FirstDate,
					LastDate:  data.LastDate,
					Played:    0,
					Scheduled: selected_day,
				}
				datastore.SetMatches(ctx, update_query)
			} else {
				log.Warningf(ctx, "Schedules.MatchScheduleCurrWeek: error get match selected day")
			}
		}
	}
	log.Infof(ctx, "schedule.MatchScheduleCurrWeek: end working!")
}
