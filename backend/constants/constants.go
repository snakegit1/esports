package constants

import (
	"golang.org/x/net/context"
)

type Config struct {
	ID                       string
	AuthRocketSubdomain      string
	AuthRocketAPIKey         string
	AuthRocketRealmID        string
	HipChatAdminToken        string
	GoogleURLShortenerAPIKey string
	StripePublicKey          string
	StripePrivateKey         string
	EmailNotificationFrom    string
	EmailNotificationTo      string
	RiotDevAPIKey            string
	RiotProdAPIKey           string
}

var (
	AuthRocketTestSubdomain = "api-e1"
	AuthRocketTestApiKey    = "ko_0vUugm49rHGrX43rr721C1-P14xy5z5H6NhCEv9uS6fhXyEzDyRF1E2BoYA8n6Vbdv"
	AuthRocketTestRealmID   = "rl_0vV0FfZFzFexjuZky9V0SV"

	AuthRocketProdSubdomain = "api-e1"
	AuthRocketProdApiKey    = "ko_0vUugm49rHGrX43rr721C1-P14xy5z5H6NhCEv9uS6fhXyEzDyRF1E2BoYA8n6Vbdv"
	AuthRocketProdRealmID   = "rl_0vVTytq8cz1Ssxok0JvSeq"

	GoogleURLShortenerAPIKey = "AIzaSyB-3alu7E9Scv5GlBOjdAoqSn1qpFSijzg"  // NOTE: same for prod/test because who cares.
	HipChatToken             = "eNHcj9D1Fm4AkdGLLJcsZbTMDncB8nEH0cw0JTd7" // NOTE: SAME! I don't seem to be able to create new hipchat groups. They want you to use stride. https://confluence.atlassian.com/stride-documentation/faq-stride-and-hipchat-cloud-937165565.html?_ga=2.165793406.1503285314.1506031428-1137747457.1506031428#FAQ:StrideandHipChatCloud-Whycan'tIcreateanewHipchatgroupnow?

	// TODO(Authrocket): They provide the jwt secret, so if we want to cut down on API calls we could
	// just do our own (offline) token checking
	// yfix test stripe keys
	StripePublicTestKey  = "pk_test_9D3cuKrgSSce87d4BWyTL6As"
	StripePrivateTestKey = "sk_test_Ri5dcZot9a9RSMK6UDLcxka5"

	// RIOT API Keys
	RiotDevAPIKey  = "RGAPI-22204876-68b8-4605-bb47-5141f96bb2d4" // available only 24 hours, then should be regenerated
	RiotProdAPIKey = "RGAPI-da83138a-756c-4837-8054-863fbf58d382" // 20 requests every 1 seconds 100 requests every 2 minutes

	//	StripePublicTestKey  = "pk_test_gkKiXex5z6F68GJwrzyzBiLF"
	//	StripePrivateTestKey = "sk_test_sMn6UWnbGg6klD9woSwkh8ut"

	StripePublicProdKey  = "pk_live_zXTifE12ulkpx5IyfcZNjNrx"
	StripePrivateProdKey = "sk_live_k60qpMmFgiZkaSUd0291Xs0Y"

	ConfigDev = Config{
		ID:                       "dev",
		AuthRocketSubdomain:      AuthRocketTestSubdomain,
		AuthRocketAPIKey:         AuthRocketTestApiKey,
		AuthRocketRealmID:        AuthRocketTestRealmID,
		GoogleURLShortenerAPIKey: GoogleURLShortenerAPIKey,
		HipChatAdminToken:        HipChatToken,
		StripePublicKey:          StripePublicTestKey,
		StripePrivateKey:         StripePrivateTestKey,
		EmailNotificationFrom:    "anything@esportsleague-gg.appspotmail.com", // this may not work. see chat.go for an email that does.
		EmailNotificationTo:      "cameront+dev@gmail.com",
		RiotDevAPIKey:            RiotDevAPIKey,
		RiotProdAPIKey:           RiotProdAPIKey,
	}

	ConfigProd = Config{
		ID:                       "prod",
		AuthRocketSubdomain:      AuthRocketProdSubdomain,
		AuthRocketAPIKey:         AuthRocketProdApiKey,
		AuthRocketRealmID:        AuthRocketProdRealmID,
		GoogleURLShortenerAPIKey: GoogleURLShortenerAPIKey,
		HipChatAdminToken:        HipChatToken,
		StripePublicKey:          StripePublicProdKey,
		StripePrivateKey:         StripePrivateProdKey,
		EmailNotificationFrom:    "anything@esportsleague-gg.appspotmail.com", // this may not work. see chat.go for an email that does.
		EmailNotificationTo:      "brettmcdonald22@gmail.com",
		RiotDevAPIKey:            RiotDevAPIKey,
		RiotProdAPIKey:           RiotProdAPIKey,
	}
)

func GetConfig(ctx context.Context) Config {
	v := ctx.Value("conf")
	if v == nil {
		return ConfigProd
	}
	return v.(Config)
}
