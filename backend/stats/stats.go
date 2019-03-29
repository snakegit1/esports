package stats

import (
	"fmt"
	"encoding/json"
	"github.com/yfix/esportsleague/backend/lolapi/matchstruct"
	"github.com/yfix/esportsleague/backend/datastore"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type TotalUserStats struct{
	TeamStats []*TeamStats `json:"team_stats"`
	UserStats []*UserStats `json:"user_stats"`
}

func CalculateStats(ctx context.Context, UserID string) (res *TotalUserStats){
	log.Infof(ctx, "stats.CalculateStats: get user stats")
	// teams stats block
	team_stats, err := CalculateTeamStats(ctx, UserID)
	if err != nil{
		log.Warningf(ctx, "stats.CalculateStats: catch error: %v", err)
	}
	// user stats block
	user_stats, err := CalculateUserStats(ctx, UserID)
	if err != nil{
		log.Warningf(ctx, "stats.CalculateStats: catch error: %v", err)
	}
	res = &TotalUserStats{
		TeamStats : team_stats,
		UserStats : user_stats,
	}
	return res
}

type TeamStats struct {
	TeamName string  `json:team_name`
	Wins     int     `json:"wins"`
	Losses   int     `json:looses`
	Kills    int     `json:kills`
	Deaths   int     `json:deaths`
	Assissts int     `json:assissts`
	Wards    int     `json:wards`
	Gold_10  string  `json:gold_10`
	Gold_20  string  `json:gold_20`
}

/*
Wins/Losses
Team totals in the following stats: 
	KDA
	Gold Differential at 10 mins
	Gold DIfferential at 20 mins
	Wards placed per minute
*/
func CalculateTeamStats(ctx context.Context, UserID string) (res []*TeamStats, err error){
	log.Infof(ctx, "stats.CalculateTeamStats: get team stats")
	team, err := datastore.GetTeamsByUserID(ctx, UserID)
	if err != nil {
		log.Warningf(ctx, "stats.CalculateTeamStats: catch error: %v", err)
		return nil, fmt.Errorf("Teams not found")
	}
	teams, err := datastore.GetDivisionTeams(ctx, team[0].Division)
	if len(teams) < 1{
		return nil, fmt.Errorf("Teams not found")
	}
	for _, val := range teams{
		stats, err := datastore.GetBattleStatsTeam(ctx, val.ID)
		if err != nil {
			log.Warningf(ctx, "stats.CalculateTeamStats: catch error: %v", err)
		}
		// stats team 
		_stats := make([]*matchstruct.Participant, 0)
		var gold_10 float64
		var gold_20 float64
		wins, loose := 0,0
		kills, deaths, assissts, wards := 0,0,0,0
		if len(stats) > 0 {
			for _, data := range stats{
				err = json.Unmarshal(data.BattleStats, &_stats)
				swins, sloose := 0,0
				for _, ust := range _stats{
					if swins < 1 && ust.Stats.Win == true{
						swins++
					}
					if sloose < 1 && ust.Stats.Win == false{
						sloose++
					}
					kills = kills + ust.Stats.Kills
					deaths = deaths + ust.Stats.Deaths
					assissts = assissts + ust.Stats.Assists
					wards = wards + ust.Stats.WardsPlaced
					gold_10 = gold_10 + ust.Timeline.GoldPerMinDeltas["0-10"]
					gold_20 = gold_20 + ust.Timeline.GoldPerMinDeltas["10-20"]
				}
				wins += swins
				loose += sloose
			}
		}
		res = append(res, &TeamStats{
			TeamName : val.Name,
			Wins     : wins,
			Losses   : loose,
			Kills    : kills,
			Deaths   : deaths,
			Assissts : assissts,
			Wards    : wards,
			Gold_10  : fmt.Sprintf("%.2f", gold_10),
			Gold_20  : fmt.Sprintf("%.2f", gold_20),
		})
	}
	return res, nil
}

type UserStats struct {
	UserName string  `json:user_name`
	TeamName string  `json:team_name`
	Kills    int     `json:kills`
	Deaths   int     `json:deaths`
	Assissts int     `json:assissts`
	Wards    int     `json:wards`
	Gold_10  float64 `json:gold_10`
	Gold_20  float64 `json:gold_20`
	Gold10   string  `json:gold10`
	Gold20   string  `json:gold20`
}
/*
KDA
Gold at 10
Gold at 20
Wards placed per minute
*/
func CalculateUserStats(ctx context.Context, UserID string) (res []*UserStats, err error){
	log.Infof(ctx, "stats.CalculateTeamStats:for user UserID: %v", UserID)
	team, err := datastore.GetTeamsByUserID(ctx, UserID)
	if err != nil {
		log.Warningf(ctx, "stats.CalculateTeamStats: catch error: %v", err)
		return nil, fmt.Errorf("Teams not found")
	}
	if len(team[0].UserIDs) < 1 {
		return nil, fmt.Errorf("Team user empty")
	}
	user_stats := make(map[string]*UserStats, 0)
	for _, uid := range team[0].UserIDs{
		profile, err := datastore.GetProfile(ctx, uid)
		if err != nil {
			continue
		}
		stats, err := datastore.GetBattleStatsUser(ctx, uid)
		if err != nil {
			log.Warningf(ctx, "stats.CalculateTeamStats: catch error: %v", err)
			continue
		}
		// stats user
		for _, data := range stats{
			var _stats matchstruct.Participant
			err = json.Unmarshal(data.BattleStats, &_stats)

			if _, ok := user_stats[profile.InGameName]; !ok {
				user_stats[profile.InGameName] = &UserStats{}
			}
			user_stats[profile.InGameName].Kills    += _stats.Stats.Kills
			user_stats[profile.InGameName].Deaths   += _stats.Stats.Deaths
			user_stats[profile.InGameName].Assissts += _stats.Stats.Assists
			user_stats[profile.InGameName].Wards    += _stats.Stats.WardsPlaced
			user_stats[profile.InGameName].Gold_10  += _stats.Timeline.GoldPerMinDeltas["0-10"]
			user_stats[profile.InGameName].Gold_20  += _stats.Timeline.GoldPerMinDeltas["10-20"]
		}
	}
	for k, v := range user_stats{
		res = append(res, &UserStats{
			UserName : k,
			TeamName : team[0].Name,
			Kills    : v.Kills,
			Deaths   : v.Deaths,
			Assissts : v.Assissts,
			Wards    : v.Wards,
			Gold_10  : v.Gold_10,
			Gold_20  : v.Gold_20,
			Gold10   : fmt.Sprintf("%.2f", v.Gold_10),
			Gold20   : fmt.Sprintf("%.2f", v.Gold_20),
		})
	}
	return res, nil
}
