package lolapi

import (
	"net/url"
//	"strconv"
//	"strings"
	"golang.org/x/net/context"
//	"google.golang.org/appengine/log"
)

// ChampDataTags tags that provide modifiers of what data is returned on a champion request
type ChampDataTag string

const (
	ChampDataNil         ChampDataTag = ""
	ChampDataAll         ChampDataTag = "all"
	ChampDataAllyTips    ChampDataTag = "allytips"
//	ChampDataAltImages   ChampDataTag = "altimages"
	ChampDataBlurb       ChampDataTag = "blurb"
	ChampDataFormat      ChampDataTag = "format"
	ChampDataEnemyTips   ChampDataTag = "enemytips"
//	ChampDataImage       ChampDataTag = "image"
	ChampDataInfo        ChampDataTag = "info"
	ChampDataLore        ChampDataTag = "lore"
	ChampDataParType     ChampDataTag = "partype"
	ChampDataPassive     ChampDataTag = "passive"
	ChampDataRecommended ChampDataTag = "recommended"
	ChampDataSkins       ChampDataTag = "skins"
	ChampDataSpells      ChampDataTag = "spells"
	ChampDataStats       ChampDataTag = "stats"
	ChampDataTags        ChampDataTag = "tags"
)

// https://developer.riotgames.com/api/methods#!/1055/3633

// StaticChampion get static champion data
// If version is not defined then it uses the current version
func (c *APIClient) StaticChampion(ctx context.Context, version string, champData ...ChampDataTag) (*ChampionData, error) {
	// setup api query options
	q := url.Values{}
	if version != "" {
		q.Add("version", version)
	}
	if len(champData) > 0 {
		for i := range champData {
			q.Add("champListData", string(champData[i]))
		}
	}
	var cl ChampionData
	err := c.makeStaticRequest("GET", "static-data", "champions", q, true, &cl)
	if err != nil {
		return &cl, err
	}
	return &cl, err
}

