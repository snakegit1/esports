package datastore

import (
	"encoding/base64"
	"fmt"
	"time"

	//	"github.com/yfix/esportsleague/backend/lolapi/matchstruct"

	"golang.org/x/net/context"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

type Profile struct {
	UserID             string    `json:"user_id"             datastore:"user_id"`
	PrimaryPositions   []string  `json:"primary_positions"   datastore:"primary_positions,noindex"`
	SecondaryPositions []string  `json:"secondary_positions" datastore:"secondary_positions,noindex"`
	RankLevel          string    `json:"rank_level"          datastore:"rank_level"` // bronze, silver, etc.
	RankTier           int64     `json:"rank_tier"           datastore:"rank_tier"`  // 1, 2, 3, 4
	InGameName         string    `json:"in_game_name"        datastore:"in_game_name"`
	DesiredOutcome     string    `json:"desired_outcome"     datastore:"desired_outcome,noindex"`
	Practice           bool      `json:"practice"            datastore:"practice,noindex"`
	Timezone           string    `json:"timezone"            datastore:"timezone,noindex"`
	Coaching           bool      `json:"coaching"            datastore:"coaching,noindex"`
	Casting            bool      `json:"casting"             datastore:"casting,noindex"`
	ReferringUserID    string    `json:"referring_user_id"   datastore:"referring_user_id"`
	ReferralCode       string    `json:"referral_code"       datastore:"-"`
	StripeCustomerID   string    `json:"stripe_customer_id"  datastore:"stripe_customer_id,noindex"`
	HipChatUsername    string    `json:"hipchat_username"    datastore:"hipchat_username,noindex"`
	HipChatPassword    string    `json:"hipchat_password"    datastore:"hipchat_password,noindex"`
	LastPaymentDate    time.Time `json:"last_payment"        datastore:"last_payment"`
}

// NOTE: the user-specified profile should NEVER be passed through this function
// without first going through CopyProfileTo() to make sure they don't edit
// fields they're not supposed to.
func UpdateProfile(ctx context.Context, profile *Profile) (*Profile, error) {
	log.Infof(ctx, "datastore.UpdateProfile %+v", profile)
	key := datastore.NewKey(ctx, "profile", profile.UserID, 0, nil)
	if _, err := datastore.Put(ctx, key, profile); err != nil {
		return nil, err
	}
	return profile, nil
}

func GetProfiles(ctx context.Context, limit, offset int) ([]*Profile, error) {
	q := datastore.NewQuery("profile").Offset(offset)
	if limit > 0 {
		q = q.Limit(limit)
	}

	profiles := []*Profile{}
	_, err := q.GetAll(ctx, &profiles)
	return profiles, err
}

func GetProfile(ctx context.Context, userID string) (*Profile, error) {
	key := datastore.NewKey(ctx, "profile", userID, 0, nil)

	profile := &Profile{UserID: userID}
	err := datastore.Get(ctx, key, profile)
	if err == datastore.ErrNoSuchEntity {
		log.Infof(ctx, "returning empty profile for non-existant key: %s", userID)
		err = nil
	}

	if err == nil {
		profile.ReferralCode = base64.RawURLEncoding.EncodeToString([]byte(profile.UserID))
	}
	return profile, err
}

func GetIDsToNames(ctx context.Context, userIDs []string, paidSince time.Time) (map[string]interface{}, error) {
	query := datastore.NewQuery("profile")
	it := query.Run(ctx)

	res := map[string]interface{}{}

	for {
		var p Profile
		_, err := it.Next(&p)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		res[p.UserID] = map[string]interface{}{
			"in_game_name":      p.InGameName,
			"last_payment_date": p.LastPaymentDate,
		}
	}

	return res, nil
}

// CopyProfile preserves all fields that the user does not have permission to
// change by copying those fields from from to to.
func CopyProfileTo(from Profile, to *Profile) {
	to.HipChatUsername = from.HipChatUsername
	to.HipChatPassword = from.HipChatPassword
	to.ReferralCode = from.ReferralCode
	to.ReferringUserID = from.ReferringUserID
	to.StripeCustomerID = from.StripeCustomerID
	to.UserID = from.UserID
	to.LastPaymentDate = from.LastPaymentDate
}

func GetProfileIGN(ctx context.Context, IGN string) (*Profile, error) {
	query := datastore.NewQuery("profile").Filter("in_game_name =", IGN)
	profiles := []*Profile{}
	_, err := query.GetAll(ctx, &profiles)
	if err != nil {
		log.Warningf(ctx, "datastore.GetProfileIGN error: %v", err)
		return nil, err
	}
	if len(profiles) < 1 {
		return &Profile{}, nil
	}
	return profiles[0], nil
}

type Team struct {
	ID       string   `json:"id"       datastore:"id"`
	Name     string   `json:"name"     datastore:"name"`
	Region   string   `json:"region"   datastore:"region"`
	Division string   `json:"division" datastore:"division"`
	UserIDs  []string `json:"user_ids" datastore:"user_ids"`
}

func DeleteTeam(ctx context.Context, teamID string) error {
	return datastore.Delete(ctx, datastore.NewKey(ctx, "team", teamID, 0, nil))
}

func UpdateTeam(ctx context.Context, team *Team) (*Team, error) {
	log.Infof(ctx, "datastore.UpdateTeam %+v", team)

	if team.ID == "" {
		low, _, err := datastore.AllocateIDs(ctx, "team", nil, 1)
		if err != nil {
			return nil, err
		}
		team.ID = fmt.Sprintf("%d", low)
	}

	key := datastore.NewKey(ctx, "team", team.ID, 0, nil)
	if _, err := datastore.Put(ctx, key, team); err != nil {
		return nil, err
	}
	return team, nil
}

func GetTeamsByUserID(ctx context.Context, userID string) ([]*Team, error) {
	log.Infof(ctx, "datastore.GetTeamsByUserID %v", userID)
	query := datastore.NewQuery("team").Filter("user_ids =", userID)
	teams := []*Team{}
	keys, err := query.GetAll(ctx, &teams)
	if err != nil {
		log.Warningf(ctx, "datastore.GetTeamsByUserID error: %v", err)
		return nil, err
	}

	for i := range teams {
		teams[i].ID = keys[i].StringID()
	}

	return teams, nil
}

func GetTeamByID(ctx context.Context, teamID string) (*Team, error) {
	log.Infof(ctx, "datastore.GetTeamsByID %v", teamID)
	key := datastore.NewKey(ctx, "team", teamID, 0, nil)
	team := &Team{ID: teamID}
	err := datastore.Get(ctx, key, team)
	if err != nil {
		log.Warningf(ctx, "datastore.GetTeamsByID error: %v", err)
		return nil, err
	}
	return team, nil
}

func GetTeams(ctx context.Context, limit, offset int) ([]*Team, error) {
	//log.Infof(ctx, "datastore.GetTeams %v", IDs)
	query := datastore.NewQuery("team").Limit(limit).Offset(offset)
	teams := []*Team{}
	keys, err := query.GetAll(ctx, &teams)
	if err != nil {
		log.Warningf(ctx, "datastore.GetTeams error: %v", err)
		return nil, err
	}

	for i := range teams {
		teams[i].ID = keys[i].StringID()
	}
	return teams, nil
}

type StoredDivisions struct {
	Division string `json:"division" datastore:"division"`
	Region   string `json:"region"   datastore:"region"`
}

func GetTeamsDivisions(ctx context.Context) ([]*StoredDivisions, error) {
	query := datastore.NewQuery("team").Project("division", "region").Distinct()
	divisions := []*StoredDivisions{}
	_, err := query.GetAll(ctx, &divisions)
	if err != nil {
		log.Warningf(ctx, "datastore.GetTeamsDivisions error: %v", err)
		return nil, err
	}
	return divisions, nil
}

func GetDivisionTeams(ctx context.Context, division string) ([]*Team, error) {
	query := datastore.NewQuery("team").Filter("division =", division)
	teams := []*Team{}
	_, err := query.GetAll(ctx, &teams)
	if err != nil {
		log.Warningf(ctx, "datastore.GetDivisionTeams error: %v", err)
		return nil, err
	}
	return teams, nil
}

func GetNumTeamPlayers(ctx context.Context, TeamID string) (int, error) {
	query := datastore.NewQuery("team").Filter("id =", TeamID)
	team := []*Team{}
	_, err := query.GetAll(ctx, &team)
	if err != nil {
		return 0, err
	}
	num := len(team[0].UserIDs)
	return num, nil
}

type Draft struct {
	Date time.Time `json:"date" datastore:"date"`
}

func UpdateDraftDate(ctx context.Context, time time.Time) (time.Time, error) {
	log.Infof(ctx, "datastore.UpdateDraftDate %v", time)
	key := datastore.NewKey(ctx, "draft", "next", 0, nil)
	_, err := datastore.Put(ctx, key, &Draft{Date: time})
	return time, err
}

func GetDraftDate(ctx context.Context, after time.Time) (*time.Time, error) {
	log.Infof(ctx, "datastore.GetDraftDate %v", after)

	drafts := []*Draft{}
	q := datastore.NewQuery("draft").Filter("date >=", after)
	_, err := q.GetAll(ctx, &drafts)

	if err != nil {
		return nil, err
	}
	if len(drafts) > 0 {
		return &drafts[0].Date, nil
	}
	return nil, nil
}

type ScheduleUserToMatches struct {
	ID       string   `json:"id"        datastore:"id"`
	UserID   string   `json:"user_id"   datastore:"UserID"`
	TeamID   string   `json:"team_id"   datastore:"TeamID"`
	MatchID  string   `json:"match_id"  datastore:"match_id"`
	Dates    string   `json:"dates"     datastore:"week_dates"`
	DateTime []string `json:"date_time" datastore:"date_time"`
}

func SetUserSchedules(ctx context.Context, userSchedules *ScheduleUserToMatches) error {
	log.Infof(ctx, "datastore.setUserSchedule %+v", userSchedules)
	str_key := fmt.Sprintf("%v_%v", userSchedules.ID, userSchedules.UserID)
	key := datastore.NewKey(ctx, "user_schedules", str_key, 0, nil)
	if _, err := datastore.Put(ctx, key, userSchedules); err != nil {
		return err
	}
	return nil
}

func GetSchedulesByUID(ctx context.Context, UserID string) ([]*ScheduleUserToMatches, error) {
	log.Infof(ctx, "datastore.GetSchedulesByUID %v", UserID)

	schedules := []*ScheduleUserToMatches{}
	q := datastore.NewQuery("user_schedules").Filter("UserID =", UserID)
	_, err := q.GetAll(ctx, &schedules)

	if err != nil {
		return nil, err
	}
	return schedules, nil
}

func GetSchedulesByMatch(ctx context.Context, ID string) ([]*ScheduleUserToMatches, error) {
	log.Infof(ctx, "datastore.GetSchedulesByMatch %v", ID)

	schedules := []*ScheduleUserToMatches{}
	q := datastore.NewQuery("user_schedules").Filter("id =", ID)
	_, err := q.GetAll(ctx, &schedules)

	if err != nil {
		return nil, err
	}
	return schedules, nil
}

func GetNumSchedules(ctx context.Context, ID string) (int, error) {
	num, err := datastore.NewQuery("user_schedules").Filter("id =", ID).Count(ctx)
	if err != nil {
		log.Warningf(ctx, "datastore.GetNumSchedules: error get match num schedules: %v", err)
		return 0, err
	}
	log.Infof(ctx, "datastore.GetSchedulesByMatch: players count schedules is: %d", num)
	return num, nil
}

type Match struct {
	ID        string    `json:"id"        datastore:"id"`
	MatchID   string    `json:"match_id"  datastore:"match_id"`
	Division  string    `json:"division"  datastore:"division"`
	Region    string    `json:"region"    datastore:"region"`
	Side1     string    `json:"side_1"    datastore:"side_1"`
	Side2     string    `json:"side_2"    datastore:"side_2"`
	FirstDate time.Time `json:"firstdate" datastore:"first_date"`
	LastDate  time.Time `json:"lastdate"  datastore:"last_date"`
	Scheduled string    `json:"scheduled" datastore:"scheduled"`
	Played    int       `json:"played"    datastore:"played"`
}

func GetLastMatchID(ctx context.Context) string {
	last_match := []Match{}
	q := datastore.NewQuery("matches").Order("-id").Limit(1)
	_, err := q.GetAll(ctx, &last_match)
	if err != nil {
		return "0"
	}
	if len(last_match) > 0 {
		return last_match[0].ID
	}
	return "0"
}

func SetMatches(ctx context.Context, match_data *Match) error {
	key := datastore.NewKey(ctx, "matches", match_data.ID, 0, nil)
	if _, err := datastore.Put(ctx, key, match_data); err != nil {
		return err
	}
	return nil
}

func GetCurrWeekMatches(ctx context.Context, filter *Match) ([]*Match, error) {
	matches := []*Match{}
	q := datastore.NewQuery("matches").Filter("first_date >=", filter.FirstDate).Filter("first_date <=", filter.LastDate).Filter("played =", 0)
	// if _, ok := interface{}(filter.FirstDate).(time.Time); ok {
	// 	q.Filter("first_date >=", filter.FirstDate)
	// }
	// if _, ok := interface{}(filter.LastDate).(time.Time); ok {
	// 	q.Filter("first_date <=", filter.LastDate)
	// }
	// if filter.Played > -1 {
	// 	q.Filter("played =", 1)
	// }
	// q.Filter("played =", 1)
	// q.Order("id")
	_, _ = q.GetAll(ctx, &matches)
	return matches, nil

}

func GetMatchFilter(ctx context.Context, filter *Match) ([]*Match, error) {
	matches := []*Match{}
	q := datastore.NewQuery("matches")
	if filter.ID != "" {
		q.Filter("id=", filter.ID)
	}
	if filter.MatchID != "" {
		q.Filter("match_id =", filter.MatchID)
	}
	if filter.Division != "" {
		q.Filter("division =", filter.Division)
	}
	if filter.Region != "" {
		q.Filter("region =", filter.Region)
	}
	if filter.Side1 != "" {
		q.Filter("side_1 =", filter.Side1)
	}
	if filter.Side2 != "" {
		q.Filter("side_2 =", filter.Side2)
	}
	if _, ok := interface{}(filter.FirstDate).(time.Time); ok {
		q.Filter("first_date >=", filter.FirstDate)
	}
	if _, ok := interface{}(filter.LastDate).(time.Time); ok {
		q.Filter("last_date <=", filter.LastDate)
	}
	if filter.Scheduled != "" {
		q.Filter("scheduled =", filter.Scheduled)
	}
	if filter.Played > -1 {
		q.Filter("played =", filter.Played)
	}
	q.Order("id")
	_, err := q.GetAll(ctx, &matches)
	if err != nil {
		return nil, err
	}
	return matches, nil
}

func CheckIsScheduled(ctx context.Context, ID, UserID string) bool {
	str_key := fmt.Sprintf("%v_%v", ID, UserID)
	key := datastore.NewKey(ctx, "user_schedules", str_key, 0, nil)

	schedule := &ScheduleUserToMatches{ID: ID}
	err := datastore.Get(ctx, key, schedule)
	if err == datastore.ErrNoSuchEntity {
		return false
	}
	return true
}

// RIOT API
type RiotGameNames struct {
	UserID     string `json:"user_id"       datastore:"user_id"`
	InGameName string `json:"in_game_name"  datastore:"in_game_name"`
}

func GetUserGameNames(ctx context.Context) ([]*RiotGameNames, error) {
	game_names := []*RiotGameNames{}
	q := datastore.NewQuery("profile").Project("user_id", "in_game_name").Filter("in_game_name >", "")
	_, err := q.GetAll(ctx, &game_names)
	return game_names, err
}

type SummonerInfo struct {
	UserID       string `json:"user_id"         datastore:"user_id"`
	SummonerID   int    `json:"summoner_id"    datastore:"summoner_id"`
	AccountID    int    `json:"account_id"     datastore:"account_id"`
	Name         string `json:"name"           datastore:"name"`
	ProfileIcon  int    `json:"profile_Icon"   datastore:"profile_icon,noindex"`
	Level        int    `json:"summoner_level" datastore:"level,noindex"`
	RevisionDate int    `json:"revision_date"  datastore:"revision_date,noindex"`
}

func SetSummonerInfo(ctx context.Context, data *SummonerInfo) error {
	key := datastore.NewKey(ctx, "game_accounts", data.UserID, 0, nil)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		return err
	}
	return nil
}

type RiotChampionsShort struct {
	ID   int    `json:"id"    datastore:"id"`
	Name string `json:"name"  datastore:"name"`
}

func SetChampions(ctx context.Context, data *RiotChampionsShort) error {
	key := datastore.NewKey(ctx, "game_champions", "", int64(data.ID), nil)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		return err
	}
	return nil
}

func GetChampions(ctx context.Context) ([]*RiotChampionsShort, error) {
	champions := []*RiotChampionsShort{}
	q := datastore.NewQuery("game_champions")
	_, err := q.GetAll(ctx, &champions)
	return champions, err
}

func GetChampionByID(ctx context.Context, champID int) (*RiotChampionsShort, error) {
	key := datastore.NewKey(ctx, "game_champions", "", int64(champID), nil)

	champion := &RiotChampionsShort{}
	err := datastore.Get(ctx, key, champion)
	if err == datastore.ErrNoSuchEntity {
		log.Infof(ctx, "datastore:Search champion by non-existant key: %d", champID)
		return nil, err
	}
	return champion, nil
}

type BattleExists struct {
	LastID int     `json:"last_id"`
	Battle *Battle `json:"battle"`
}

func CheckBattleExists(ctx context.Context, lol_battle_id string) (res *BattleExists, err error) {
	battle := []*Battle{}
	q := datastore.NewQuery("battles").Filter("lol_battle_id =", lol_battle_id)
	_, err = q.GetAll(ctx, &battle)
	if err != nil {
		log.Warningf(ctx, "datastore.CheckBattleExists: error check battle exists: %v", err)
	}
	last_record := []Battle{}
	query := datastore.NewQuery("battles").Order("-battle_id").Limit(1)
	_, err = query.GetAll(ctx, &last_record)
	last_id := 0
	if err != nil {
		last_id = 0
		log.Warningf(ctx, "datastore.CheckBattleExists: error get last battle id: %v", err)
	}
	//	log.Infof(ctx, "riotapi.Debug: length %d data %#v", len(last_record), last_record)
	if len(last_record) > 0 {
		last_id = last_record[0].BattleID
	}
	info := &Battle{}
	if len(battle) > 0 {
		info = battle[0]
	}
	res = &BattleExists{
		LastID: last_id,
		Battle: info,
	}
	return res, nil
}

type FullMatchStats struct {
	LolBattleID string `json:"lol_battle_id"  datastore:"lol_battle_id"`
	MatchStats  []byte `json:"match_stats"    datastore:"match_stats,noindex"`
}

func SetRiotMatchStats(ctx context.Context, data *FullMatchStats) error {
	key := datastore.NewKey(ctx, "riot_match_stats", data.LolBattleID, 0, nil)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		log.Warningf(ctx, "datastore.SetRiotMatchStats: catch error: %v", err)
		return err
	}
	return nil
}

func GetStatsByLolID(ctx context.Context, LolBattleID string) (*FullMatchStats, error) {
	key := datastore.NewKey(ctx, "riot_match_stats", LolBattleID, 0, nil)

	match_stats := &FullMatchStats{}
	err := datastore.Get(ctx, key, match_stats)
	if err == datastore.ErrNoSuchEntity {
		log.Warningf(ctx, "datastore:GetStatsByLolID non-existant key: %v", LolBattleID)
		return nil, err
	}
	return match_stats, nil
}

type Battle struct {
	BattleID     int      `json:"battle_id"         datastore:"battle_id"`
	MatchID      string   `json:"match_id"          datastore:"match_id"`
	LolBattleID  string   `json:"lol_battle_id"     datastore:"lol_battle_id"`
	WinTeamID    string   `json:"winteam_id"        datastore:"win_team_id"`
	Team1Players []string `json:"team1_players"     datastore:"team1_players"`
	Team2Players []string `json:"team2_players"     datastore:"team2_players"`
}

/*
type BattleUser struct {
	BattleID      int     `json:"battle_id"      datastore:"battle_id"`
	MatchID       int     `json:"match_id"       datastore:"match_id"`
	UserID        string  `json:"user_id"        datastore:"user_id"`
	InGameName    string  `json:"ingame_name"    datastore:"ingame_name"`
	LolBattleID   string  `json:"lol_battle_id"  datastore:"lol_battle_id"`
	TeamID        string  `json:"team_id"        datastore:"team_id"`
}
*/

type BattleStatsUser struct {
	BattleID    int    `json:"battle_id"      datastore:"battle_id"`
	MatchID     string `json:"match_id"       datastore:"match_id"`
	TeamID      string `json:"team_id"        datastore:"team_id"`
	UserID      string `json:"user_id"        datastore:"user_id"`
	ChampionID  int    `json:"champion_id"    datastore:"champion_id"`
	InGameName  string `json:"ingame_name"    datastore:"ingame_name"`
	LolBattleID string `json:"lol_battle_id"  datastore:"lol_battle_id"`
	BattleStats []byte `json:"battle_stats"   datastore:"battle_stats,noindex"`
}

type BattleStatsTeam struct {
	BattleID    int    `json:"battle_id"      datastore:"battle_id"`
	MatchID     string `json:"match_id"       datastore:"match_id"`
	TeamID      string `json:"team_id"        datastore:"team_id"`
	LolBattleID string `json:"lol_battle_id"  datastore:"lol_battle_id"`
	BattleStats []byte `json:"battle_stats"   datastore:"battle_stats,noindex"`
}

func SetBattleStatsUser(ctx context.Context, data *BattleStatsUser) error {
	str_key := fmt.Sprintf("%v_%v_%v", data.BattleID, data.MatchID, data.InGameName)
	log.Infof(ctx, "datastore:SetBattleStatsUser: use key: %v", str_key)
	key := datastore.NewKey(ctx, "battle_user_stats", str_key, 0, nil)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		log.Warningf(ctx, "datastore.SetBattleStatsUser: catch error: %v", err)
		return err
	}
	return nil
}

func SetBattleStatsTeam(ctx context.Context, data *BattleStatsTeam) error {
	str_key := fmt.Sprintf("%v_%v_%v", data.BattleID, data.MatchID, data.TeamID)
	key := datastore.NewKey(ctx, "battle_team_stats", str_key, 0, nil)
	log.Infof(ctx, "datastore:SetBattleStatsTeam: use key: %v", str_key)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		log.Warningf(ctx, "datastore.SetBattleStatsTeam: catch error: %v", err)
		return err
	}
	return nil
}

func SetBattle(ctx context.Context, data *Battle) error {
	log.Infof(ctx, "datastore:SetBattle: use key: %d", data.BattleID)
	key := datastore.NewKey(ctx, "battles", "", int64(data.BattleID), nil)
	if _, err := datastore.Put(ctx, key, data); err != nil {
		log.Warningf(ctx, "datastore.SetBattle: catch error: %v", err)
		return err
	}
	return nil
}

func GetBattles(ctx context.Context, match_id string) ([]*Battle, error) {
	battles := []*Battle{}
	query := datastore.NewQuery("battles").Filter("match_id =", match_id)
	_, err := query.GetAll(ctx, &battles)
	if err != nil {
		return nil, err
	}
	return battles, nil
}

func GetBattleStatsTeam(ctx context.Context, TeamID string) ([]*BattleStatsTeam, error) {
	log.Infof(ctx, "datastore:GetBattleStatsTeam: teamid is: %v", TeamID)
	team_records := []*BattleStatsTeam{}
	query := datastore.NewQuery("battle_team_stats").Filter("team_id =", TeamID)
	_, err := query.GetAll(ctx, &team_records)
	if err != nil {
		return nil, err
	}
	return team_records, nil
}

func GetBattleStatsUser(ctx context.Context, UserID string) ([]*BattleStatsUser, error) {
	log.Infof(ctx, "datastore:GetBattleStatsUser: userid is: %v", UserID)
	user_records := []*BattleStatsUser{}
	query := datastore.NewQuery("battle_user_stats").Filter("user_id =", UserID)
	_, err := query.GetAll(ctx, &user_records)
	if err != nil {
		return nil, err
	}
	return user_records, nil
}

type CheckMatchsRes struct {
	CountBattles int `json:"count_battles"`
	ReadyMatches int `json:"ready_matches"`
}

func CheckMatches(ctx context.Context, match_id, division, next_id string) (*CheckMatchsRes, error) {
	num, err := datastore.NewQuery("battles").Filter("match_id =", match_id).Count(ctx)
	if err != nil {
		log.Warningf(ctx, "datastore.GetNumSchedules: error get num battles: %v", err)
		return nil, err
	}
	ready_matches := 0
	key := datastore.NewKey(ctx, "matches", next_id, 0, nil)
	match := &Match{}
	err = datastore.Get(ctx, key, match)
	if err == datastore.ErrNoSuchEntity {
		log.Infof(ctx, "datastore: non-existant key: %s", next_id)
	}
	if err != nil {
		log.Warningf(ctx, "datastore.GetNumSchedules: error get num match: %v", err)
	} else if match.Side1 == "" && match.Side2 == "" {
		ready_matches = 1
	}
	return &CheckMatchsRes{CountBattles: num, ReadyMatches: ready_matches}, nil
}
