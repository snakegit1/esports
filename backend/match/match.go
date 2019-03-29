package match

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/yfix/esportsleague/backend/datastore"
	"github.com/yfix/esportsleague/backend/utils"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

const WeekSeason = 6 // season contains 6 weeks

type MatchNode struct {
	id   int
	next *MatchNode
}

// algorithm based on robin round
func GenerateMatches(ctx context.Context) {
	divisions, err := datastore.GetTeamsDivisions(ctx)

	if err != nil {
		log.Warningf(ctx, "get divisions catch error: %v", err)
	}

	if len(divisions) < 1 {
		return
	}

	weeks_dates := utils.GenerateWeekDates(1, WeekSeason)
	_id, _ := strconv.Atoi(datastore.GetLastMatchID(ctx))

	for _, data := range divisions {
		div_teams, err := datastore.GetDivisionTeams(ctx, data.Division)

		if err != nil {
			log.Warningf(ctx, "GetDivisionTeams catch error: %v", err)
		}

		if len(div_teams)%2 != 0 {
			continue
		}

		nodes := []*MatchNode{}
		for s := 1; s < len(div_teams); s++ {
			node := &MatchNode{id: s}
			nodes = append(nodes, node)
		}

		for i, node := range nodes {
			if i == len(div_teams)-2 {
				node.next = nodes[0]
			} else {
				node.next = nodes[i+1]
			}
		}

		for i := 0; i < len(div_teams)-1; i++ {
			start := nodes[i]
			curr := start.next
			week_match := []int{0, start.id}
			for curr != start {
				week_match = append(week_match, curr.id)
				curr = curr.next
			}

			for t := 0; t < len(week_match)/2; t++ {
				t1 := week_match[t]
				t2 := week_match[len(week_match)-t-1]
				match := &datastore.Match{
					ID:        strconv.Itoa(_id),
					MatchID:   weeks_dates[i].MatchID,
					Division:  data.Division,
					Region:    data.Region,
					Side1:     div_teams[t1].ID,
					Side2:     div_teams[t2].ID,
					FirstDate: weeks_dates[i].FirstDate,
					LastDate:  weeks_dates[i].LastDate,
					Played:    0,
				}
				_id++
				utils.Log(ctx, match, "Match")
				datastore.SetMatches(ctx, match)
			}
		}
	}
}

func OrganizeMatches(ctx context.Context) {
	divisions, err := datastore.GetTeamsDivisions(ctx)
	if err != nil {
		log.Warningf(ctx, "get divisions catch error: %v", err)
	}
	if len(divisions) < 1 {
		return
	}
	_id, _ := strconv.Atoi(datastore.GetLastMatchID(ctx))
	weeks_dates := utils.GenerateWeekDates(1, WeekSeason)
	num_matches := 0
	for _, data := range divisions {
		div_teams, err := datastore.GetDivisionTeams(ctx, data.Division)
		if err != nil {
			log.Warningf(ctx, "GetDivisionTeams catch error: %v", err)
		}
		if len(div_teams) < 4 {
			continue
		}
		if len(div_teams)%2 == 0 {
			num_matches = len(div_teams) * (len(div_teams) - 1) / 2
		} else {
			continue
		}
		//-------------------------- shaking commands --------------------------------------------
		rand.Seed(time.Now().Unix())
		first_team := div_teams[rand.Intn(len(div_teams))]
		opponents := []*datastore.Team{}
		second_stage := []*datastore.Team{}
		for _, i := range div_teams {
			curr_team := i
			if first_team.ID == curr_team.ID {
				continue
			}
			opponents = append(opponents, curr_team)
		}
		last_team := opponents[0]
		// if len(opponents) == (num_matches / 2) {
		for _, s := range opponents {
			if last_team.ID == s.ID {
				continue
			}
			second_stage = append(second_stage, s)
		}
		// }
		//----------------------------------------------------------------------------------------
		v := 0
		k := num_matches / 2

		utils.Log(ctx, div_teams, "Div Teams")
		utils.Log(ctx, first_team, "First Team")
		utils.Log(ctx, last_team, "Last Team")
		utils.Log(ctx, opponents, "Opponents")
		utils.Log(ctx, second_stage, "Second Stage")
		//--------------------------------- set opponents ----------------------------------
		for i := 0; i < num_matches-1; {
			if i < len(opponents) {
				_id++
				datastore.SetMatches(ctx, &datastore.Match{
					ID:        strconv.Itoa(_id),
					MatchID:   weeks_dates[i].MatchID,
					Division:  data.Division,
					Region:    data.Region,
					Side1:     first_team.ID,
					Side2:     opponents[i].ID,
					FirstDate: weeks_dates[i].FirstDate,
					LastDate:  weeks_dates[i].LastDate,
					Played:    0,
				})
				if opponents[i].ID == last_team.ID {
					_id++
					datastore.SetMatches(ctx, &datastore.Match{
						ID:        strconv.Itoa(_id),
						MatchID:   weeks_dates[i].MatchID,
						Division:  data.Division,
						Region:    data.Region,
						Side1:     second_stage[0].ID,
						Side2:     second_stage[1].ID,
						FirstDate: weeks_dates[i].FirstDate,
						LastDate:  weeks_dates[i].LastDate,
						Played:    0,
					})
				}
				if i < len(second_stage) {
					if opponents[i].ID != last_team.ID && opponents[i].ID != second_stage[i].ID {
						_id++
						datastore.SetMatches(ctx, &datastore.Match{
							ID:        strconv.Itoa(_id),
							MatchID:   weeks_dates[i].MatchID,
							Division:  data.Division,
							Region:    data.Region,
							Side1:     last_team.ID,
							Side2:     second_stage[i].ID,
							FirstDate: weeks_dates[i].FirstDate,
							LastDate:  weeks_dates[i].LastDate,
							Played:    0,
						})
					}
				} else {
					for s := 0; s < len(second_stage); {
						if opponents[i].ID != last_team.ID && opponents[i].ID != second_stage[s].ID {
							_id++
							datastore.SetMatches(ctx, &datastore.Match{
								ID:        strconv.Itoa(_id),
								MatchID:   weeks_dates[i].MatchID,
								Division:  data.Division,
								Region:    data.Region,
								Side1:     last_team.ID,
								Side2:     second_stage[s].ID,
								FirstDate: weeks_dates[i].FirstDate,
								LastDate:  weeks_dates[i].LastDate,
								Played:    0,
							})
						}
						s++
					}
				}
			}
			i++
		}
		// second iteration opponents
		for k < (len(opponents)*2)-1 {
			_id++
			datastore.SetMatches(ctx, &datastore.Match{
				ID:        strconv.Itoa(_id),
				MatchID:   weeks_dates[k].MatchID,
				Division:  data.Division,
				Region:    data.Region,
				Side1:     first_team.ID,
				Side2:     opponents[v].ID,
				FirstDate: weeks_dates[k].FirstDate,
				LastDate:  weeks_dates[k].LastDate,
				Played:    0,
			})
			if opponents[v].ID == last_team.ID {
				_id++
				datastore.SetMatches(ctx, &datastore.Match{
					ID:        strconv.Itoa(_id),
					MatchID:   weeks_dates[k].MatchID,
					Division:  data.Division,
					Region:    data.Region,
					Side1:     second_stage[1].ID,
					Side2:     second_stage[0].ID,
					FirstDate: weeks_dates[k].FirstDate,
					LastDate:  weeks_dates[k].LastDate,
					Played:    0,
				})
			}
			for s := 0; s < len(second_stage); {
				if opponents[v].ID != last_team.ID && opponents[v].ID != second_stage[s].ID {
					_id++
					datastore.SetMatches(ctx, &datastore.Match{
						ID:        strconv.Itoa(_id),
						MatchID:   weeks_dates[k].MatchID,
						Division:  data.Division,
						Region:    data.Region,
						Side1:     last_team.ID,
						Side2:     second_stage[s].ID,
						FirstDate: weeks_dates[k].FirstDate,
						LastDate:  weeks_dates[k].LastDate,
						Played:    0,
					})
				}
				s++
			}
			v++
			k++
		}
		last_key := len(weeks_dates) - 1
		_id++
		datastore.SetMatches(ctx, &datastore.Match{
			ID:        strconv.Itoa(_id),
			MatchID:   weeks_dates[last_key].MatchID,
			Division:  data.Division,
			Region:    data.Region,
			Side1:     "",
			Side2:     "",
			FirstDate: weeks_dates[last_key].FirstDate,
			LastDate:  weeks_dates[last_key].LastDate,
			Played:    0,
		})
	}
}

func GetMatchesUserID(ctx context.Context, UserID string) ([]*datastore.Match, error) {
	teams, err := datastore.GetTeamsByUserID(ctx, UserID)
	if err != nil {
		log.Warningf(ctx, "match.GetMatchesUserID: datastore team error: %v", err)
	}
	if len(teams) < 1 {
		return nil, fmt.Errorf("Not team member")
	}
	team_data := &datastore.Team{}
	for i := range teams {
		if team_data.ID == "" {
			team_data = teams[i]
		}
	}
	/*	week_dates := GenerateWeekDates(1, WeekSeason)
		first_date := week_dates[0].FirstDate
		num_weeks := len(week_dates) - 1
		last_date := week_dates[num_weeks].LastDate
	*/
	user_matches, err := datastore.GetMatchFilter(ctx, &datastore.Match{
		Division: team_data.Division,
		Region:   team_data.Region,
		Played:   0,
		/*		FirstDate: first_date,
				LastDate : last_date,
		*/
	})
	if err != nil {
		log.Warningf(ctx, "match.GetMatchesUserID: datastore match error: %v", err)
		return nil, err
	}
	if len(user_matches) < 1 {
		return nil, fmt.Errorf("Team matches not found")
	}
	matches_data := []*datastore.Match{}
	for _, data := range user_matches {
		if data.Division != team_data.Division {
			continue
		}
		if data.Played == 1 {
			continue
		}
		if data.Side1 == "" && data.Side2 == "" {
			matches_data = append(matches_data, data)
		}
		if data.Side1 != team_data.ID && data.Side2 != team_data.ID {
			continue
		}
		matches_data = append(matches_data, data)
	}
	return matches_data, nil
}

type MatchTeamPlayers struct {
	Team1 map[string]string `json:"team1"`
	Team2 map[string]string `json:"team2"`
	Match *datastore.Match  `json:"match"`
}

func GetMatchPlayers(ctx context.Context, match_id string, for_select bool) (*MatchTeamPlayers, error) {
	log.Infof(ctx, "match.GetMatchPlayers: get match players ingamename for match %v", match_id)
	match_info, err := datastore.GetMatchFilter(ctx, &datastore.Match{ID: match_id})
	if err != nil {
		log.Warningf(ctx, "match.GetMatchPlayers: get match players catch error %v", err)
		return nil, err
	}
	match := &datastore.Match{}
	for _, i := range match_info {
		if i.ID == match_id {
			match = i
			break
		}
	}
	team1, _ := datastore.GetTeamByID(ctx, match.Side1)
	team_players1 := make(map[string]string)
	if len(team1.UserIDs) > 0 {
		k := 1
		for _, u := range team1.UserIDs {
			profile, _ := datastore.GetProfile(ctx, u)
			if profile.InGameName == "" {
				continue
			}
			if for_select == true {
				team_players1[fmt.Sprintf("team_player%v", k)] = profile.InGameName
			} else {
				team_players1[profile.InGameName] = profile.UserID
			}
			k++
		}
	}
	team_players2 := make(map[string]string)
	team2, _ := datastore.GetTeamByID(ctx, match.Side2)
	if len(team2.UserIDs) > 0 {
		k := 1
		for _, u := range team2.UserIDs {
			profile, _ := datastore.GetProfile(ctx, u)
			if profile.InGameName == "" {
				continue
			}
			if for_select == true {
				team_players2[fmt.Sprintf("opponent_player%v", k)] = profile.InGameName
			} else {
				team_players2[profile.InGameName] = profile.UserID
			}
			k++
		}
	}
	result := &MatchTeamPlayers{
		Team1: team_players1,
		Team2: team_players2,
		Match: match,
	}
	return result, nil
}
