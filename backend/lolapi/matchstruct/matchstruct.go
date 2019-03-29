package matchstruct

import "time"

type Match struct {
	SeasonID              Season                `datastore:",noindex"`
	QueueID               int                   `datastore:",noindex"`
	GameID                int64                 `datastore:",noindex"`
	ParticipantIdentities []ParticipantIdentity `datastore:",noindex"`
	GameVersion           string                `datastore:",noindex"`
	PlatformID            string                `datastore:",noindex"`
	GameMode              string                `datastore:",noindex"`
	MapID                 int                   `datastore:",noindex"`
	GameType              string                `datastore:",noindex"`
	Teams                 []TeamStats           `datastore:",noindex"`
	Participants          []Participant         `datastore:",noindex"`
	GameDuration          Milliseconds          `datastore:",noindex"`
	GameCreation          Milliseconds          `datastore:",noindex"`
}

type ParticipantIdentity struct {
	Player        Player
	ParticipantID int
}

type Player struct {
	CurrentPlatformID string
	SummonerName      string
	MatchHistoryUri   string
	PlatformID        string
	CurrentAccountID  int64
	ProfileIcon       int
	SummonerID        int64
	AccountID         int64
}

type TeamStats struct {
	FirstDragon          bool
	FirstInhibitor       bool
	Bans                 []TeamBans
	BaronKills           int
	FirstRiftHerald      bool
	FirstBaron           bool
	RiftHeraldKills      int
	FirstBlood           bool
	TeamID               int
	FirstTower           bool
	VilemawKills         int
	InhibitorKills       int
	TowerKills           int
	DominionVictoryScore int
	Win                  string
	DragonKills          int
}

type TeamBans struct {
	PickTurn   int
	ChampionID int
}

type Participant struct {
	Stats                     ParticipantStats
	ParticipantID             int
	Runes                     []Rune
	Timeline                  ParticipantTimeline
	TeamID                    int
	Spell2ID                  int
	Masteries                 []Mastery
	HighestAchievedSeasonTier string
	Spell1ID                  int
	ChampionID                int
}

type ParticipantStats struct {
	PhysicalDamageDealt             int64
	NeutralMinionsKilledTeamJungle  int
	MagicDamageDealt                int64
	TotalPlayerScore                int
	Deaths                          int
	Win                             bool
	NeutralMinionsKilledEnemyJungle int
	AltarsCaptured                  int
	LargestCriticalStrike           int
	TotalDamageDealt                int64
	MagicDamageDealtToChampions     int64
	VisionWardsBoughtInGame         int
	DamageDealtToObjectives         int64
	LargestKillingSpree             int
	Item1                           int
	QuadraKills                     int
	TeamObjective                   int
	TotalTimeCrowdControlDealt      int
	LongestTimeSpentLiving          int
	WardsKilled                     int
	FirstTowerAssist                bool
	FirstTowerKill                  bool
	Item2                           int
	Item3                           int
	Item0                           int
	FirstBloodAssist                bool
	VisionScore                     int64
	WardsPlaced                     int
	Item4                           int
	Item5                           int
	Item6                           int
	TurretKills                     int
	TripleKills                     int
	DamageSelfMitigated             int64
	ChampLevel                      int
	NodeNeutralizeAssist            int
	FirstInhibitorKill              bool
	GoldEarned                      int
	MagicalDamageTaken              int64
	Kills                           int
	DoubleKills                     int
	NodeCaptureAssist               int
	TrueDamageTaken                 int64
	NodeNeutralize                  int
	FirstInhibitorAssist            bool
	Assists                         int
	UnrealKills                     int
	NeutralMinionsKilled            int
	ObjectivePlayerScore            int
	CombatPlayerScore               int
	DamageDealtToTurrets            int64
	AltarsNeutralized               int
	PhysicalDamageDealtToChampions  int64
	GoldSpent                       int
	TrueDamageDealt                 int64
	TrueDamageDealtToChampions      int64
	ParticipantID                   int
	PentaKills                      int
	TotalHeal                       int64
	TotalMinionsKilled              int
	FirstBloodKill                  bool
	NodeCapture                     int
	LargestMultiKill                int
	SightWardsBoughtInGame          int
	TotalDamageDealtToChampions     int64
	TotalUnitsHealed                int
	InhibitorKills                  int
	TotalScoreRank                  int
	TotalDamageTaken                int64
	KillingSprees                   int
	TimeCCingOthers                 int64
	PhysicalDamageTaken             int64

	Perk0     int64
	Perk0Var1 int
	Perk0Var2 int
	Perk0Var3 int

	Perk1     int64
	Perk1Var1 int
	Perk1Var2 int
	Perk1Var3 int

	Perk2     int64
	Perk2Var1 int
	Perk2Var2 int
	Perk2Var3 int

	Perk3     int64
	Perk3Var1 int
	Perk3Var2 int
	Perk3Var3 int

	Perk4     int64
	Perk4Var1 int
	Perk4Var2 int
	Perk4Var3 int

	Perk5     int64
	Perk5Var1 int
	Perk5Var2 int
	Perk5Var3 int

	PerkPrimaryStyle int64
	PerkSubStyle     int64
}

type Rune struct {
	RuneID int
	Rank   int
}

// Interval represents a range of game time, measured in minutes.
//
// The value 999 is used to represent an endpoint that is coded as the literal
// string "end"
type Interval struct {
/*	Begin int
	End   int
	*/
	Range string
}

// IntervalValues represents a mapping from intervals to values.
type IntervalValues []IntervalValue


type IntervalValue struct {
	Interval Interval
	Value    float64
}

// temporary disabled
type ParticipantTimeline struct {
	Lane                        Lane
	ParticipantID               int
	CSDiffPerMinDeltas          map[string]float64
	GoldPerMinDeltas            map[string]float64
	XPDiffPerMinDeltas          map[string]float64
	CreepsPerMinDeltas          map[string]float64
	XPPerMinDeltas              map[string]float64
	Role                        string
	DamageTakenDiffPerMinDeltas map[string]float64
	DamageTakenPerMinDeltas     map[string]float64
}
type Mastery struct {
	MasteryID int
	Rank      int
}
type Matchlist struct {
	Matches    []MatchReference `datastore:",noindex"`
	TotalGames int              `datastore:",noindex"`
	StartIndex int              `datastore:",noindex"`
	EndIndex   int              `datastore:",noindex"`
}

type MatchReference struct {
	Lane       Lane
	GameID     int64
	Champion   int
	PlatformID string
	Season     Season
	Queue      Queue
	Role       string
	Timestamp  Milliseconds
}

// GetMatchlistOptions provides filtering options for GetMatchlist. The zero
// value means that the option will not be used in filtering.
type GetMatchlistOptions struct {
	Queue      []Queue
	Season     []Season
	Champion   []int
	BeginTime  *time.Time
	EndTime    *time.Time
	BeginIndex *int
	EndIndex   *int
}

type MatchTimeline struct {
	Frames        []MatchFrame       `datastore:",noindex"`
	FrameInterval Milliseconds `datastore:",noindex"`
}

// ParticipantFrames stores frames corresponding to each participant. The order
// is not defined (i.e. do not assume the order is ascending by participant ID).
type ParticipantFrames struct {
	Frames []MatchParticipantFrame
}

type MatchFrame struct {
	Timestamp         Milliseconds
	ParticipantFrames ParticipantFrames
	Events            []MatchEvent
}

type MatchParticipantFrame struct {
	TotalGold           int
	TeamScore           int
	ParticipantID       int
	Level               int
	CurrentGold         int
	MinionsKilled       int
	DominionScore       int
	Position            MatchPosition
	XP                  int
	JungleMinionsKilled int
}

type MatchPosition struct {
	Y int
	X int
}

type MatchEvent struct {
	EventType               string
	TowerType               string
	TeamID                  int
	AscendedType            string
	KillerID                int
	LevelUpType             string
	PointCaptured           string
	AssistingParticipantIDs []int
	WardType                string
	MonsterType             string
	Type                    Event
	SkillSlot               int
	VictimID                int
	Timestamp               Milliseconds
	AfterID                 int
	MonsterSubType          string
	LaneType                Type
	ItemID                  int
	ParticipantID           int
	BuildingType            string
	CreatorID               int
	Position                MatchPosition
	BeforeID                int
}

type Season int

const (
	Preseason3 Season = iota
	Season3
	Preseason2014
	Season2014
	Preseason2015
	Season2015
	Preseason2016
	Season2016
	Preseason2017
	Season2017
)

type Lane string
type Type string

const (
	Middle Lane = "MIDDLE"
	Top         = "TOP"
	Jungle      = "JUNGLE"
	Bottom      = "BOTTOM"
)

const (
	TypeMiddle Type = "MID_LANE"
	TypeTop         = "TOP_LANE"
	TypeBottom      = "BOT_LANE"
)

type Milliseconds int64

type StringInt64 int64

type Queue int

type Event string

const (
	ChampionKill     Event = "CHAMPION_KILL"
	WardPlaced             = "WARD_PLACED"
	WardKill               = "WARD_KILL"
	BuildingKill           = "BUILDING_KILL"
	EliteMonsterKill       = "ELITE_MONSTER_KILL"
	ItemPurchased          = "ITEM_PURCHASED"
	ItemSold               = "ITEM_SOLD"
	ItemDestroyed          = "ITEM_DESTROYED"
	ItemUndo               = "ITEM_UNDO"
	SkillLevelUp           = "SKILL_LEVEL_UP"
	AscendedEvent          = "ASCENDED_EVENT"
	CapturePoint           = "CAPTURE_POINT"
	PoroKingSummon         = "PORO_KING_SUMMON"
)
