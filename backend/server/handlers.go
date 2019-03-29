package backend

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/yfix/esportsleague/backend"
	"github.com/yfix/esportsleague/backend/constants"

	"github.com/julienschmidt/httprouter"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

func init() {

	router := httprouter.New()

	// cron handlers
	router.GET("/api/v1/cron/schedule-matches", ScheduleCurrWeekMatchesHandler)
	router.GET("/api/v1/riot/collect-summoners", CollectSummonersHandler)
	router.GET("/api/v1/riot/collect-champions", CollectChampionsHandler)

	router.OPTIONS("/*all", corsHandler)
	router.POST("/api/v1/announcements-get", announcementsGetHandler)
	router.POST("/api/v1/draftdate-get", draftDateGetHandler)
	router.POST("/api/v1/draftdate-update", draftDateUpdateHandler)
	router.POST("/api/v1/payment-add", paymentAddHandler)
	router.POST("/api/v1/payment-config", paymentConfigHandler)
	router.POST("/api/v1/payment-get", paymentGetHandler)
	router.POST("/api/v1/profile-get", profileGetHandler)
	router.POST("/api/v1/profile-update", profileUpdateHandler)
	router.POST("/api/v1/profiles-map", profilesMapGetHandler)
	router.POST("/api/v1/team-get", teamGetHandler)
	router.POST("/api/v1/user/create", userCreateHandler)
	router.POST("/api/v1/user/login", loginHandler)
	router.POST("/api/v1/user/resetpassword", passwordResetHandler)
	router.POST("/api/v1/user/verify", tokenVerifyHandler)

	router.POST("/api/v1/user/match-scheduling", userMatchSchedulingHandler)
	router.POST("/api/v1/user/match-scheduled", userMatchScheduledHandler)
	router.POST("/api/v1/user/match-unscheduled", userMatchUnscheduledHandler)

	router.POST("/api/v1/generate-matches", GenerateMatchesHandler)

	// RIOT API data handlers block
	router.POST("/api/v1/get-champions", GetChampionsHandler)
	router.POST("/api/v1/battle/battle-url", SetBattleUrlHandler)
	router.POST("/api/v1/battle/set-battle-stats", SetBattleStatsHandler)

	router.POST("/api/v1/stats/get-user-stats", GetUserStatsHandler)

	// admin handlers
	router.POST("/api/v1/teams-get", teamsGetHandler)
	router.POST("/api/v1/team-update", teamUpdateHandler)
	router.POST("/api/v1/profiles-get", profilesGetHandler)
	router.POST("/api/v1/payment-charge", chargeUserHandler)

	router.POST("/api/v1/admin/users", GetUsersList)

	http.Handle("/", router)
}

func corsHeaders(w http.ResponseWriter) {
	w.Header().Add("Allow", "POST")
	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Methods", "*")
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Headers", "*")
}

func corsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	corsHeaders(w)
	w.WriteHeader(200)
}

func loginHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := newContext(r)
	var (
		req backend.AuthMessage
		res *backend.AuthResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.Login(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func userCreateHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.AuthMessage
		res *backend.AuthResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.CreateUser(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func tokenVerifyHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.AuthResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.VerifyToken(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func passwordResetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.AuthMessage
		res *backend.EmptyMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.ResetPassword(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func profileGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.ProfileMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetProfile(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func profilesGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.PageMessage
		res *backend.ProfilesMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetProfiles(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func profilesMapGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.IDsToNamesMessage
		res *backend.MapMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetIDsToNames(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func profileUpdateHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.ProfileMessage
		res *backend.ProfileMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.UpdateProfile(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func paymentConfigHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.PaymentConfigResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	res, err = backend.GetPaymentConfig(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func paymentGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.PaymentResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	res, err = backend.GetPaymentDetails(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func paymentAddHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.PaymentRequest
		res *backend.PaymentResponse
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	res, err = backend.AddCustomer(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func chargeUserHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.ChargeCustomerMessage
		res *backend.EmptyMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	res, err = backend.ChargeCustomer(ctx, &req)
	sendResponse(ctx, w, res, err)
}

// func referralCodeGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
// 	ctx := newContext(r)
// 	var (
// 		req backend.ShortenMessage
// 		res *backend.StringMessage
// 		err error
// 	)
// 	if err = parseRequest(ctx, r, &req); err != nil {
// 		http.Error(w, "bad request", http.StatusBadRequest)
// 		return
// 	}

// 	res, err = backend.CreateShortReferralLink(ctx, &req)
// 	sendResponse(ctx, w, res, err)
// }

func draftDateGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.EmptyMessage
		res *backend.StringMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetNextDraft(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func draftDateUpdateHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.StringMessage
		res *backend.StringMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.SetNextDraft(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func teamGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.TeamsMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetMyTeam(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func teamsGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.PageMessage
		res *backend.TeamsMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetTeams(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func teamUpdateHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TeamMessage
		res *backend.TeamMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.UpdateTeam(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func announcementsGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.StringsMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetAnnouncements(ctx, &req)
	sendResponse(ctx, w, res, err)
}

// scheduling

func userMatchSchedulingHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.UserSchedule
		res *backend.UserScheduleResponce
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.SetUserSchedule(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func userMatchScheduledHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.ScheduleMatchesResponce
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetScheduledMatches(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func userMatchUnscheduledHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.UnscheduleMatcheResponce
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetUnscheduledMatch(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func GenerateMatchesHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.StringMessage
		res *backend.StringMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GenerateMatches(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func ScheduleCurrWeekMatchesHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	/*
		var (
			req backend.StringMessage
			res *backend.StringMessage
			err error
		)
		if err = parseRequest(ctx, r, &req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
	*/
	res, err := backend.ScheduleCurrWeekMatches(ctx)
	sendResponse(ctx, w, res, err)
}

// RIOT API handlers block

func CollectSummonersHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	res, err := backend.RiotCollectSummonerInfo(ctx)
	sendResponse(ctx, w, res, err)
}

func CollectChampionsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	res, err := backend.RiotCollectChampions(ctx)
	sendResponse(ctx, w, res, err)
}

func GetChampionsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.ChampionsResponceMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetChampions(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func SetBattleUrlHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.BattleStatsUrl
		res *backend.ChampionsSelectMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.SetBattleUrl(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func SetBattleStatsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.StatsRequest
		res *backend.StringMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.SetBattleStats(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func GetUserStatsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.StatsResponce
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetUserStats(ctx, &req)
	sendResponse(ctx, w, res, err)
}

func GetUsersList(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ctx := newContext(r)
	var (
		req backend.TokenMessage
		res *backend.UsersListMessage
		err error
	)
	if err = parseRequest(ctx, r, &req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	res, err = backend.GetUsersList(ctx, &req)
	sendResponse(ctx, w, res, err)
}

//
// Utility
//

func newContext(r *http.Request) context.Context {
	ctx := appengine.NewContext(r)

	config := constants.ConfigProd
	if strings.Contains(r.Host, "localhost") || strings.Contains(r.Host, "appspot.com") {
		log.Infof(ctx, "using dev config")
		config = constants.ConfigDev
	}

	ctx, err := appengine.Namespace(ctx, config.ID)
	if err != nil {
		log.Errorf(ctx, "error setting namespace: %v", err)
	}
	return context.WithValue(ctx, "conf", config)
}

func parseRequest(ctx context.Context, r *http.Request, v interface{}) error {
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Errorf(ctx, "error extracting request body: %v", err)
		return err
	}
	log.Infof(ctx, "handlers.parseRequest received: %s", data)
	if err = json.Unmarshal(data, v); err != nil {
		log.Errorf(ctx, "error parsing request: %v", err)
		return err
	}
	return nil
}

func sendResponse(ctx context.Context, w http.ResponseWriter, res interface{}, err error) {
	m := map[string]interface{}{
		"data": res,
	}
	if err != nil {
		m["error"] = err.Error()
	}

	data, err := json.Marshal(m)
	if err != nil {
		log.Errorf(ctx, "error marshaling response: %v", err)
	}
	corsHeaders(w)
	if _, err = w.Write(data); err != nil {
		log.Errorf(ctx, "error writing response: %v", err)
	}
}
