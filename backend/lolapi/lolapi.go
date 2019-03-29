package lolapi

import (
	"fmt"
	"strings"
	"time"
	"strconv"
	"sort"
	"encoding/json"

	"github.com/yfix/esportsleague/backend/constants"
	"github.com/yfix/esportsleague/backend/datastore"
	"github.com/yfix/esportsleague/backend/match"
	"github.com/yfix/esportsleague/backend/lolapi/matchstruct"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

const (
	Region = "na"
)

// Return a summoner by name
func GetSummonerByName(ctx context.Context, name string) (info *Summoner, err error){
	cfg := constants.GetConfig(ctx)
	ApiKey := cfg.RiotProdAPIKey
	c := NewAPIClient(ctx, Region, ApiKey)
	info, err = c.SummonerByName(name)
	if err != nil && info != nil {
		log.Warningf(ctx, "riotapi.GetSummonerByName: catch error: %v", err)
		return nil, err
	}
	log.Infof(ctx, "riotapi.GetSummonerByName: get user info: %#v", info)
	return info, nil
}

func CollectSummonersInfo(ctx context.Context){
	summoner_names, err := datastore.GetUserGameNames(ctx)
	if err != nil {
		log.Warningf(ctx, "riotapi.CollectSummonersInfo: catch datastore error: %v", err)
		return
	}
	for _, s := range summoner_names {
		if s.InGameName == "" { continue }
		summoner_info, err := GetSummonerByName(ctx, s.InGameName)
		if err != nil {
			log.Warningf(ctx, "riotapi.CollectSummonersInfo: catch error: %v", err)
			continue
		}
		datastore.SetSummonerInfo(ctx, &datastore.SummonerInfo{
			UserID       : s.UserID,
			SummonerID   : summoner_info.ID,
			AccountID    : summoner_info.AccountID,
			Name         : summoner_info.Name,
			ProfileIcon  : summoner_info.ProfileIcon,
			Level        : summoner_info.Level,
			RevisionDate : summoner_info.RevisionDate,
		})
//		log.Infof(ctx, "riotapi.CollectSummonersInfo: get info: %#v", summoner_info)
	}
	return
}

func SetSummoner(ctx context.Context, user_id, name string) {
	summoner_info, err := GetSummonerByName(ctx, name)
	if err != nil {
		log.Warningf(ctx, "riotapi.SetSummoner: catch error: %v", err)
		return
	}
	if summoner_info == nil {
		log.Warningf(ctx, "riotapi.SetSummoner: try get summoner and catch empty")
		return
	}
	datastore.SetSummonerInfo(ctx, &datastore.SummonerInfo{
		UserID       : user_id,
		SummonerID   : summoner_info.ID,
		AccountID    : summoner_info.AccountID,
		Name         : summoner_info.Name,
		ProfileIcon  : summoner_info.ProfileIcon,
		Level        : summoner_info.Level,
		RevisionDate : summoner_info.RevisionDate,
	})
	return
}

func GetStaticChampion(ctx context.Context) {
	cfg := constants.GetConfig(ctx)
	ApiKey := cfg.RiotProdAPIKey
	c := NewAPIClient(ctx, Region, ApiKey)
	info, err := c.StaticChampion(ctx, "", ChampDataFormat)
	if err != nil {
		log.Warningf(ctx, "riotapi.GetStaticChampion: catch error: %v", err)
		return
	}
	if len(info.Champions) > 0 {
		for _, data := range info.Champions {
			datastore.SetChampions(ctx, &datastore.RiotChampionsShort{
				ID   : data.ID,
				Name : data.Name,
			})
		}
	}
	return
}

type ChampionToSelect struct {
	Value int     `json:"value"`
	Label string  `json:"label"`
}

type UrlStatsResult struct {
	Champions []*ChampionToSelect     `json:"champions"`
	Teams     *match.MatchTeamPlayers `json:"team_players"`
}

func BattleUrlStats(ctx context.Context, match_id, url string) (*UrlStatsResult, error){
	log.Infof(ctx, "riotapi.BattleUrlStats: set lol battle stats by url")
	url_slice := strings.Split(url, "/")
	if len(url_slice) < 6 {
		log.Warningf(ctx, "riotapi.BattleUrlStats: catch error: Provided url is broken")
		return nil, fmt.Errorf("Provided url is broken")
	}
	lol_match_id := url_slice[6]
	battle_exists, _ := datastore.CheckBattleExists(ctx, lol_match_id)
	last_id := battle_exists.LastID
	battle := battle_exists.Battle
	if battle.BattleID > 0 {
		log.Warningf(ctx, "riotapi.BattleUrlStats: catch error: Match battle already exists")
		return nil, fmt.Errorf("Match battle already exists")
	}
	last_id++ // check this
	cfg := constants.GetConfig(ctx)
	ApiKey := cfg.RiotProdAPIKey
	c := NewAPIClient(ctx, Region, ApiKey)
	match_data, err := c.MatchData(lol_match_id)
	if err != nil {
		log.Warningf(ctx, "riotapi.BattleUrlStats: catch error: %v", err)
		return nil, err
	}
	ecoded_stats, _ := json.Marshal(match_data)
	datastore.SetRiotMatchStats(ctx, &datastore.FullMatchStats{
		LolBattleID : lol_match_id,
		MatchStats  : ecoded_stats,
	})
	champions := []*ChampionToSelect{}
	for _, v := range match_data.Participants {
		c_info, err := datastore.GetChampionByID(ctx, v.ChampionID)
		if err != nil {
			log.Warningf(ctx, "riotapi.BattleUrlStats: search champion catch error: %v", err)
			continue
		}
		champions = append(champions, &ChampionToSelect{
			Value: c_info.ID,
			Label: c_info.Name,
		})
	}
	if len(champions) < 1 {
		log.Warningf(ctx, "riotapi.BattleUrlStats: champions not found")
		return nil, fmt.Errorf("champions not found")
	}
//	log.Infof(ctx, "match.GetMatchPlayers: match data: %#v", match_info[0])
	// get teams in_game_names
	match_players, _ := match.GetMatchPlayers(ctx, match_id, true)
	results := &UrlStatsResult{
		Champions : champions,
		Teams     : match_players,
	}
	return results, nil
}

func SetBattleStats(ctx context.Context, match_id, url string, team_names, opponent_names map[string]string, team_champs, opponent_champs map[string]int) error{
	log.Infof(ctx, "riotapi.SetBattleStats: set lol battle stats into players")
	url_slice := strings.Split(url, "/")
	if len(url_slice) < 6 {
		log.Warningf(ctx, "riotapi.SetBattleStats: catch error: Provided url is broken")
		return fmt.Errorf("Provided url is broken")
	}
	lol_match_id := url_slice[6]
	// get stats info from datastore
	raw_stats, err := datastore.GetStatsByLolID(ctx, lol_match_id)
	if err != nil {
		log.Warningf(ctx, "riotapi.SetBattleStats: catch error %v:", err)
		return fmt.Errorf("Get raw battle stats catch error %v", err)
	}
	var total_stats matchstruct.Match
	err = json.Unmarshal(raw_stats.MatchStats, &total_stats)
	if err != nil {
		log.Warningf(ctx, "riotapi.SetBattleStats: catch error: %v", err)
		return fmt.Errorf("Get raw battle stats catch error %v", err)
	}
	battle_exists, _ := datastore.CheckBattleExists(ctx, lol_match_id)
	last_id := battle_exists.LastID
	battle := battle_exists.Battle
	if battle.BattleID > 0 {
		log.Warningf(ctx, "riotapi.SetBattleStats: catch error: Match battle already exists")
		// TODO check all players get them stats records
		return fmt.Errorf("Match battle already exists")
	}
	last_id++
	// connect team players to champions
	team1 := make(map[int]string)
	team2 := make(map[int]string)
	team1_players := make([]string, 0)
	team2_players := make([]string, 0)
	if len(team_names) > 0 && len(team_champs) > 0{
		for k, t1n := range team_names {
			if team_champs[k] > 0 {
				team1[team_champs[k]] = strings.TrimSpace(t1n)
				team1_players = append(team1_players, strings.TrimSpace(t1n))
			}
		}
	}
	if len(opponent_names) > 0 && len(opponent_champs) > 0{
		for k2, t2n := range opponent_names {
			if opponent_champs[k2] > 0 {
				team2[opponent_champs[k2]] = strings.TrimSpace(t2n)
				team2_players = append(team2_players, strings.TrimSpace(t2n))
			}
		}
	}
	// get match info and team players ids
	match_info, err := match.GetMatchPlayers(ctx, match_id, false)
	// set stats into datatore
	lol_teamid1, lol_teamid2 := 0, 0
	team1_stats := make([]matchstruct.Participant, 0)
	team2_stats := make([]matchstruct.Participant, 0)
	for _, stats := range total_stats.Participants{
		if team1[stats.ChampionID] != "" {
			if lol_teamid1 == 0 {
				lol_teamid1 = stats.TeamID
			}
			team1_stats = append(team1_stats, stats)
			ecoded_stats, _ := json.Marshal(stats)
			user_id := match_info.Team1[team1[stats.ChampionID]]
			if user_id == "" {
				pd, _ := datastore.GetProfileIGN(ctx, team1[stats.ChampionID])
				if pd.UserID != ""{
					user_id = pd.UserID
				}
			}
			datastore.SetBattleStatsUser(ctx, &datastore.BattleStatsUser{
				BattleID    : last_id,
				MatchID     : match_id,
				TeamID      : match_info.Match.Side1,
				UserID      : user_id,
				ChampionID  : stats.ChampionID,
				InGameName  : team1[stats.ChampionID],
				LolBattleID : lol_match_id,
				BattleStats : ecoded_stats,
			})
		}
		if team2[stats.ChampionID] != "" {
			if lol_teamid2 == 0 {
				lol_teamid2 = stats.TeamID
			}
			team2_stats = append(team2_stats, stats)
			ecoded_stats, _ := json.Marshal(stats)
			user_id := match_info.Team2[team2[stats.ChampionID]]
			if user_id == "" {
				pd, _ := datastore.GetProfileIGN(ctx, team2[stats.ChampionID])
				if pd.UserID != ""{
					user_id = pd.UserID
				}
			}
			datastore.SetBattleStatsUser(ctx, &datastore.BattleStatsUser{
				BattleID    : last_id,
				MatchID     : match_id,
				TeamID      : match_info.Match.Side2,
				UserID      : user_id,
				ChampionID  : stats.ChampionID,
				InGameName  : team2[stats.ChampionID],
				LolBattleID : lol_match_id,
				BattleStats : ecoded_stats,
			})
		}
	}
	if len(team1_stats) > 0 {
		ecoded_stats, _ := json.Marshal(team1_stats)
		datastore.SetBattleStatsTeam(ctx, &datastore.BattleStatsTeam{
			BattleID    : last_id,
			MatchID     : match_id,
			TeamID      : match_info.Match.Side1,
			LolBattleID : lol_match_id,
			BattleStats : ecoded_stats,
		})
	}
	if len(team2_stats) > 0 {
		ecoded_stats, _ := json.Marshal(team2_stats)
		datastore.SetBattleStatsTeam(ctx, &datastore.BattleStatsTeam{
			BattleID    : last_id,
			MatchID     : match_id,
			TeamID      : match_info.Match.Side2,
			LolBattleID : lol_match_id,
			BattleStats : ecoded_stats,
		})
	}
	win_team := ""
	for _, ts :=range total_stats.Teams{
		if ts.TeamID == lol_teamid1 {
			if ts.Win == "Win" {
				win_team = match_info.Match.Side1
			}else{
				win_team = match_info.Match.Side2
			}
		}
	}
	datastore.SetBattle(ctx, &datastore.Battle{
		BattleID     : last_id,
		MatchID      : match_id,
		LolBattleID  : lol_match_id,
		WinTeamID    : win_team,
		Team1Players : team1_players,
		Team2Players : team2_players,
	})
	// check need to finish match
	CheckEndMatch(ctx, match_id, match_info.Match.Division)
	return nil
}

func CheckEndMatch(ctx context.Context, match_id, division string){
	log.Infof(ctx, "riotapi.CheckEndMatch: match_id is: %v", match_id)
	time.Sleep(3 * time.Second)
	next_id, _ := strconv.Atoi(match_id)
	next_id++
	checked, err := datastore.CheckMatches(ctx, match_id, division, strconv.Itoa(next_id))
	if err != nil {
		return
	}
	log.Infof(ctx, "riotapi.CheckEndMatch: match: %#v", checked)
	if checked.CountBattles > 1 {
		// finish match
		matches, _ := datastore.GetMatchFilter(ctx, &datastore.Match{ID: match_id})
		if len(matches) > 0{
			for _, match := range matches{
//				log.Infof(ctx, "riotapi.CheckEndMatch: match is: %#v", match)
				if match.ID != match_id {
					continue
				}
				datastore.SetMatches(ctx, &datastore.Match{
					ID        : match.ID,
					MatchID   : match.MatchID,
					Division  : match.Division,
					Region    : match.Region,
					Side1     : match.Side1,
					Side2     : match.Side2,
					FirstDate : match.FirstDate,
					LastDate  : match.LastDate,
					Scheduled : match.Scheduled,
					Played    : 1,
				})
			}
		}
	}
	if checked.CountBattles > 1 && checked.ReadyMatches == 1 {
		// Set champion battles
		ChampionWeekMatches(ctx, match_id)
	}
	return
}

func ChampionWeekMatches(ctx context.Context, match_id string){
	log.Infof(ctx, "riotapi.ChampionWeekMatches")
	time.Sleep(3 * time.Second)
	match_info, err := datastore.GetMatchFilter(ctx, &datastore.Match{ID: match_id})
	last_id, _ := strconv.Atoi(match_id)
	previous_id := last_id - 9
	match_data := &datastore.Match{}
	if err != nil{
		log.Warningf(ctx, "riotapi.ChampionWeekMatches: catch error: %v", err)
		return
	}
	if len(match_info) < 1{
		log.Warningf(ctx, "riotapi.ChampionWeekMatches: catch error: match info empty")
		return
	}
	for _, i := range match_info{
		if i.ID == match_id{
			match_data = i
			break
		}
	}
	match_list, err := datastore.GetMatchFilter(ctx, &datastore.Match{Played: 1})
	if err != nil {
		log.Warningf(ctx, "riotapi.ChampionWeekMatches: catch error: %v", err)
		return
	}
	team_stats := make(map[string]int, 0)
	for _, info := range match_list{
		curr_id, _ := strconv.Atoi(info.ID)
		if curr_id >= previous_id && curr_id <= last_id && info.Division == match_data.Division{
			stats, err := datastore.GetBattles(ctx, info.ID)
			if err != nil{
				log.Warningf(ctx, "riotapi.ChampionWeekMatches: catch error when egt battle info: %v", err)
				continue
			}
			for _, b_st := range stats{
				if info.Side1 == b_st.WinTeamID{
					team_stats[info.Side1] += 1
					team_stats[info.Side2] += 0
				}else{
					team_stats[info.Side1] += 0
					team_stats[info.Side2] += 1
				}
			}
		}
	}
	sorted_teams := rankByTeamWins(team_stats)
	unplayed_matchs, err := datastore.GetMatchFilter(ctx, &datastore.Match{Played: 0, Division: match_data.Division})
	if err != nil{
		log.Warningf(ctx, "riotapi.ChampionWeekMatches: catch error: %v", err)
		return
	}
	log.Infof(ctx, "riotapi.ChampionWeekMatches: teams sorted by wins: %#v", sorted_teams)
	for _, _match := range unplayed_matchs{
		if _match.Played == 0 && _match.Division == match_data.Division{
			if len(sorted_teams) > 1{
				datastore.SetMatches(ctx, &datastore.Match{
					ID        : _match.ID,
					MatchID   : _match.MatchID,
					Division  : _match.Division,
					Region    : _match.Region,
					Side1     : sorted_teams[0].Team,
					Side2     : sorted_teams[1].Team,
					FirstDate : _match.FirstDate,
					LastDate  : _match.LastDate,
					Scheduled : _match.Scheduled,
					Played    : 0,
				})
			}
			if len(sorted_teams) > 3{
				_id, _ := strconv.Atoi(_match.ID)
				_id++
				datastore.SetMatches(ctx, &datastore.Match{
					ID        : strconv.Itoa(_id),
					MatchID   : _match.MatchID,
					Division  : _match.Division,
					Region    : _match.Region,
					Side1     : sorted_teams[2].Team,
					Side2     : sorted_teams[3].Team,
					FirstDate : _match.FirstDate,
					LastDate  : _match.LastDate,
					Scheduled : _match.Scheduled,
					Played    : 0,
				})
			}
			break
		}
	}
	return
}

func rankByTeamWins(winFrequencies map[string]int) RankList{
  rl := make(RankList, len(winFrequencies))
  i := 0
  for k, v := range winFrequencies {
    rl[i] = RankTeam{k, v}
    i++
  }
  sort.Sort(sort.Reverse(rl))
  return rl
}

type RankTeam struct {
  Team string
  Wins int
}

type RankList []RankTeam

func (p RankList) Len() int { return len(p) }
func (p RankList) Less(i, j int) bool { return p[i].Wins < p[j].Wins }
func (p RankList) Swap(i, j int){ p[i], p[j] = p[j], p[i] }
