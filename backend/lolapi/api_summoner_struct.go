package lolapi

// MasterPage a collection of summoners mastery pages
type MasteryPages struct {
	Pages []*MasteryPage `json:"pages"`
}

type SummonerMasteryList map[string]MasteryPages

// MasteryPage a mastery page
type MasteryPage struct {
	Current   bool      `json:"current"`
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Masteries []Mastery `json:"masteries"`
}

type Mastery struct {
	ID   int `json:"id"`
	Rank int `json:"rank"`
}

// SummonerRuneList a list of rune pages with sumnoner ID as the key
type SummonerRuneList map[string]*RunePages

// RunePages a set of rune pages for a summoner
type RunePages struct {
	Pages      []*RunePage `json:"pages"`
	SummonerID int         `json:"summonerId"`
}

// RunePage a page of runes
type RunePage struct {
	Current bool        `json:"current"`
	ID      int         `json:"id"`
	Name    string      `json:"name"`
	Slots   []*RuneSlot `json:"slots"`
}

// RuneSlot defines which rune is in which rune page slot
type RuneSlot struct {
	RuneID     int `json:"runeId"`
	RuneSlotID int `json:"runeSlot"`
}

