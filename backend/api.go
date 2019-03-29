package backend

import (
	"fmt"
	"time"

	/*
		"bitbucket.org/ctangney/esportsleague/backend/authrocket"
		"bitbucket.org/ctangney/esportsleague/backend/chat"
		"bitbucket.org/ctangney/esportsleague/backend/constants"
		"bitbucket.org/ctangney/esportsleague/backend/datastore"
		"bitbucket.org/ctangney/esportsleague/backend/payment"
		"bitbucket.org/ctangney/esportsleague/backend/sheets"
	*/
	"github.com/yfix/esportsleague/backend/authrocket"
	"github.com/yfix/esportsleague/backend/chat"
	"github.com/yfix/esportsleague/backend/constants"
	"github.com/yfix/esportsleague/backend/datastore"
	"github.com/yfix/esportsleague/backend/lolapi"
	"github.com/yfix/esportsleague/backend/match"
	"github.com/yfix/esportsleague/backend/payment"
	"github.com/yfix/esportsleague/backend/schedule"
	"github.com/yfix/esportsleague/backend/sheets"
	"github.com/yfix/esportsleague/backend/stats"

	//	"github.com/yfix/esportsleague/backend/lolapi"

	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type EmptyMessage struct{}

type AuthMessage struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token     string `json:"token"`
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Object    string `json:"object"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	IsAdmin   bool   `json:"is_admin"`
}

func Login(ctx context.Context, req *AuthMessage) (res *AuthResponse, err error) {
	client := authrocket.New(ctx)

	authReq := authrocket.AuthenticateRequest{
		Username: req.Email,
		Password: req.Password,
	}
	authRes, err := client.Authenticate(authReq)
	if err == nil {
		res = &AuthResponse{
			Token:     authRes.Token,
			ID:        authRes.ID,
			Username:  authRes.Username,
			Email:     authRes.Email,
			Object:    authRes.Object,
			FirstName: authRes.FirstName,
			LastName:  authRes.LastName,
			IsAdmin:   authRes.User.IsAdmin(),
		}
	}
	log.Infof(ctx, "api.Login: %+v, %v", res, err)
	return res, err
}

func CreateUser(ctx context.Context, req *AuthMessage) (res *AuthResponse, err error) {
	client := authrocket.New(ctx)

	createReq := authrocket.CreateRequest{
		User: authrocket.User{
			Email:             req.Email,
			Username:          req.Email,
			Password:          req.Password,
			UserType:          "human",
			EmailVerification: "none",
		},
	}
	log.Infof(ctx, "api.CreateUser: %+v", createReq)
	if _, err = client.Create(createReq); err == nil {
		// Login immediately so that we can get the token (which isn't returned upon creation).
		res, err = Login(ctx, req)
	}
	log.Infof(ctx, "api.CreateUser(2): %+v, %v", res, err)
	return res, err
}

type UsersListMessage struct {
	Token string             `json:"token,omitempty"` // only necessary for requests
	Users []*authrocket.User `json:"users"`
}

func GetUsersList(ctx context.Context, req *TokenMessage) (res *UsersListMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, req)
	if err != nil {
		log.Warningf(ctx, "api.UsersList: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("only admins can fetch all profiles")
	}

	client := authrocket.New(ctx)
	r, err := client.GetUsersList()

	if err != nil {
		return nil, err
	}
	users := &UsersListMessage{Users: r.Collection}
	return users, nil
}

type TokenMessage struct {
	Token string `json:"token"`
}

type UserIDMessage struct {
	UserID  string `json:"user_id"`
	Email   string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
}

// TODO(Cameron): Cache the result of this until expiration.
func VerifyToken(ctx context.Context, req *TokenMessage) (res *AuthResponse, err error) {
	client := authrocket.New(ctx)

	session, err := client.VerifySession(req.Token)
	if err == nil {
		res = &AuthResponse{
			Token:     req.Token,
			ID:        session.User.ID,
			Username:  session.User.Username,
			Email:     session.User.Email,
			Object:    session.User.Object,
			FirstName: session.User.FirstName,
			LastName:  session.User.LastName,
			IsAdmin:   session.User.IsAdmin(),
		}
	}
	log.Infof(ctx, "api.VerifyToken: %+v, %+v", res, err)
	return res, err
}

func ResetPassword(ctx context.Context, req *AuthMessage) (res *EmptyMessage, err error) {
	client := authrocket.New(ctx)
	_, err = client.ResetPassword(req.Email)
	if err != nil {
		log.Warningf(ctx, "api.ResetPassword error: %v", err)
	}
	return &EmptyMessage{}, nil
}

//
// Profiles
//

type ProfileMessage struct {
	Token   string             `json:"token,omitempty"` // only necessary for requests
	Profile *datastore.Profile `json:"profile"`
}

func GetProfile(ctx context.Context, req *TokenMessage) (res *ProfileMessage, err error) {
	verifyMsg, err := VerifyToken(ctx, req)
	if err != nil {
		log.Warningf(ctx, "api.GetProfile: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	profile, err := datastore.GetProfile(ctx, verifyMsg.ID)
	if err == nil {
		res = &ProfileMessage{Profile: profile}
	}
	return res, err
}

type ProfilesMessage struct {
	Profiles []*datastore.Profile `json:"profiles"`
}

func GetProfiles(ctx context.Context, req *PageMessage) (res *ProfilesMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetProfile: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("only admins can fetch all profiles")
	}

	profiles, err := datastore.GetProfiles(ctx, req.Limit, req.Offset)
	return &ProfilesMessage{Profiles: profiles}, err
}

type MapMessage struct {
	Map map[string]interface{} `json:"map"`
}

type IDsToNamesMessage struct {
	Token        string    `json:"token"`
	UserIDs      []string  `json:"user_ids"`
	PaymentSince time.Time `json:"payment_since"`
}

func GetIDsToNames(ctx context.Context, req *IDsToNamesMessage) (res *MapMessage, err error) {
	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetIDsToNames: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	m, err := datastore.GetIDsToNames(ctx, req.UserIDs, req.PaymentSince)
	if err != nil {
		log.Warningf(ctx, "api.GetIDsToNames: error getting mapping %v", err)
		return nil, err
	}
	return &MapMessage{Map: m}, nil
}

func UpdateProfile(ctx context.Context, req *ProfileMessage) (*ProfileMessage, error) {
	verifyMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.UpdateProfile: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	profile, err := datastore.GetProfile(ctx, verifyMsg.ID)
	if err != nil {
		log.Warningf(ctx, "api.UpdateProfile: error getting profile: %v", err)
		return nil, fmt.Errorf("unable to save profile, please contact support")
	}

	createChatUser := profile.InGameName == "" && req.Profile.InGameName != ""
	datastore.CopyProfileTo(*profile, req.Profile)
	_, err = datastore.UpdateProfile(ctx, req.Profile)

	if req.Profile.InGameName != "" {
		lolapi.SetSummoner(ctx, verifyMsg.ID, req.Profile.InGameName)
	}
	if err == nil && createChatUser {
		_, err = CreateHipchatUser(ctx, &TokenMessage{Token: req.Token})
		if err != nil {
			log.Errorf(ctx, "error creating hipchat user: %v", err)
		}
	}

	return &ProfileMessage{Profile: req.Profile}, err
}

//
// Payments
//

type PaymentConfigResponse struct {
	StripePublicKey string `json:"stripe_public_key"`
}

func GetPaymentConfig(ctx context.Context, req *TokenMessage) (res *PaymentConfigResponse, err error) {
	if _, err = VerifyToken(ctx, &TokenMessage{Token: req.Token}); err != nil {
		log.Warningf(ctx, "api.GetPaymentConfig: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	return &PaymentConfigResponse{
		StripePublicKey: constants.GetConfig(ctx).StripePublicKey,
	}, nil
}

type PaymentRequest struct {
	Token       string            `json:"token"`
	CouponCode  string            `json:"coupon_code"`
	StripeToken StripeClientToken `json:"stripe_token"`
}

type StripeClientToken struct {
	ID       string     `json:"id"`
	Object   string     `json:"object"`
	Card     StripeCard `json:"card"`
	ClientIP string     `json:"client_ip"`
	LiveMode bool       `json:"livemode"`
	Type     string     `json:"type"`
	Used     bool       `json:"used"`
}

type StripeCard struct {
	ID         string `json:"id"`
	AddressZip string `json:"address_zip"`
	Last4      string `json:"last4"`
	Brand      string `json:"brand"`
	ExpMonth   uint8  `json:"exp_month"`
	ExpYear    uint16 `json:"exp_year"`
	Name       string `json:"name"`
}

type PaymentResponse struct {
	Card StripeCard `json:"card"`
}

func GetPaymentDetails(ctx context.Context, req *TokenMessage) (res *PaymentResponse, err error) {
	verifyMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetPaymentDetails: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	profile, err := datastore.GetProfile(ctx, verifyMsg.ID)
	if err != nil {
		log.Warningf(ctx, "api.GetPaymentDetails: get profile error: %v", err)
		return nil, fmt.Errorf("unable to fetch profile")
	}

	if profile.StripeCustomerID == "" {
		log.Infof(ctx, "api.GetPaymentDetails: no customer id set for user")
		return nil, nil
	}

	// cus, err := payment.GetCustomer(ctx, profile.StripeCustomerID)
	// if err != nil {
	// 	log.Warningf(ctx, "api.GetPaymentDetails: customer fetch error: %v", err)
	// 	return nil, fmt.Errorf("unable to get customer info")
	// }

	// if cus.Sources == nil || len(cus.Sources.Values) == 0 || cus.Sources.Values[0].Card == nil {
	// 	log.Infof(ctx, "api.GetPaymentDetails: no payment source for specified customer")
	// 	return res, fmt.Errorf("no payment source for specified customer")
	// }

	// card := cus.Sources.Values[0].Card
	// card := cus.DefaultSource.Card
	// res = &PaymentResponse{
	// 	Card: StripeCard{
	// 		ID:         card.ID,
	// 		AddressZip: card.Zip,
	// 		Brand:      string(card.Brand),
	// 		ExpMonth:   card.Month,
	// 		ExpYear:    card.Year,
	// 		Last4:      card.LastFour,
	// 		Name:       card.Name,
	// 	},
	// }
	// return res, nil
	return nil, nil
}

func AddCustomer(ctx context.Context, req *PaymentRequest) (res *PaymentResponse, err error) {

	verifyMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.AddSubscription: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	profile, err := datastore.GetProfile(ctx, verifyMsg.ID)
	if err != nil {
		log.Warningf(ctx, "api.AddSubscription: get profile error: %v", err)
		return nil, fmt.Errorf("unable to fetch profile")
	}
	if profile.StripeCustomerID == "" {
		cus, err := payment.CreateStripeCustomer(ctx, req.StripeToken.ID, profile.UserID, verifyMsg.Email)
		if err != nil {
			log.Warningf(ctx, "api.AddSubscription: customer creation error: %v", err)
			return nil, fmt.Errorf("unable to create customer")
		}

		profile.StripeCustomerID = cus.ID
		profile, err = datastore.UpdateProfile(ctx, profile)
		if err != nil {
			log.Warningf(ctx, "api.AddSubscription: profile save error: %v", err)
			return nil, fmt.Errorf("unable to save profile")
		}
	} else {
		_, err = payment.AddStripeSourceToCustomer(ctx, req.StripeToken.ID, profile.StripeCustomerID)
		if err != nil {
			log.Warningf(ctx, "api.AddSubscription: source update error: %v", err)
			return nil, fmt.Errorf("unable to update payment source")
		}
	}
	if req.CouponCode != "" {
		// check coupon
		coupon, err := payment.CheckCouponCode(ctx, req.CouponCode)
		if err != nil {
			return nil, fmt.Errorf("Coupon invalid: %s", req.CouponCode)
		}
		// add coupon into customer
		if coupon != nil {
			_, err := payment.AddCouponCustomer(ctx, profile.StripeCustomerID, req.CouponCode)
			if err != nil {
				log.Warningf(ctx, "api.UpdateCustomer: add coupon into customer: %v", err)
				return nil, fmt.Errorf("unable to add coupon into customer")
			}
		}
	}

	// TODO (Add plan ish)

	res = &PaymentResponse{
		Card: req.StripeToken.Card,
	}
	return res, nil
}

type ChargeCustomerMessage struct {
	Token       string `json:"token"`
	UserID      string `json:"user_id"`
	AmountCents uint64 `json:"amount_cents"`
}

func ChargeCustomer(ctx context.Context, req *ChargeCustomerMessage) (res *EmptyMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.ChargeCustomer: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("only admins can charge customers")
	}

	profile, err := datastore.GetProfile(ctx, req.UserID)
	if err != nil {
		log.Warningf(ctx, "api.ChargeCustomer: get profile error: %v", err)
		return nil, fmt.Errorf("unable to fetch profile for id: %s", req.UserID)
	}

	if profile.StripeCustomerID == "" {
		err = fmt.Errorf("profile has no stripe customer id: %s", req.UserID)
	} else {
		err = payment.ChargeStripeCustomer(ctx, profile.StripeCustomerID, req.AmountCents)
		if err == nil {
			profile.LastPaymentDate = time.Now()
			datastore.UpdateProfile(ctx, profile)
		}
	}
	return &EmptyMessage{}, err
}

//
// Chat
//

type HipChatAccountMessage struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type hipChatUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateHipchatUser(ctx context.Context, req *TokenMessage) (res *HipChatAccountMessage, err error) {
	verifyMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.CreateHipchatUser: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	profile, err := datastore.GetProfile(ctx, verifyMsg.ID)
	if err != nil {
		log.Warningf(ctx, "api.CreateHipchatUser: get profile error: %v", err)
		return nil, fmt.Errorf("unable to fetch profile")
	}

	if profile.HipChatUsername != "" && profile.HipChatPassword != "" {
		log.Infof(ctx, "api.CreateHipchatUser: create called for user with account already: %v", profile.HipChatUsername)
		return &HipChatAccountMessage{
			Username: profile.HipChatUsername,
			Password: profile.HipChatPassword,
		}, nil
	}

	password, err := chat.CreateUser(ctx, profile.InGameName, verifyMsg.Email)
	if err != nil {
		log.Warningf(ctx, "api.CreateHipchatUser: get profile error: %v", err)
		return nil, fmt.Errorf("unable to create chat user")
	}

	// // Bug with hipchat requires us to manually re-activate users, so we deactivate them to start
	// // and send an email to an admin.
	// if err = chat.DeactivateUser(ctx, userIDMsg.Email); err != nil {
	// 	log.Errorf(ctx, "error deactivating user: %v", err)
	// }

	res = &HipChatAccountMessage{
		Username: verifyMsg.Email,
		Password: password,
	}

	return res, nil
}

//
// Teams
//

type PageMessage struct {
	Token  string `json:"token"`
	Limit  int    `json:"limit"`
	Offset int    `json:"offset"`
}

type TeamsMessage struct {
	Teams []*datastore.Team `json:"teams"`
}

func GetMyTeam(ctx context.Context, req *TokenMessage) (res *TeamsMessage, err error) {
	verifyMsg, err := VerifyToken(ctx, req)
	if err != nil {
		log.Warningf(ctx, "api.GetMyTeam: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	var teams []*datastore.Team
	teams, err = datastore.GetTeamsByUserID(ctx, verifyMsg.ID)

	if err != nil {
		log.Warningf(ctx, "api.GetMyTeam error fetching teams: %v", err)
		return nil, fmt.Errorf("cannot get team")
	}

	return &TeamsMessage{Teams: teams}, nil
}

func GetTeams(ctx context.Context, req *PageMessage) (res *TeamsMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetTeams: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	var teams []*datastore.Team
	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("only admins can get all teams")
	}

	teams, err = datastore.GetTeams(ctx, req.Limit, req.Offset)
	if err != nil {
		log.Warningf(ctx, "api.GetTeams error fetching teams: %v", err)
		return nil, fmt.Errorf("cannot get teams")
	}

	return &TeamsMessage{Teams: teams}, nil
}

type TeamMessage struct {
	Token string          `json:"token,omitempty"`
	Team  *datastore.Team `json:"team"`
}

func UpdateTeam(ctx context.Context, req *TeamMessage) (res *TeamMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.UpdateTeam: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("you must be in the admins group to update a team")
	}

	var team *datastore.Team
	if req.Team.ID != "" && req.Team.Name == "" {
		err = datastore.DeleteTeam(ctx, req.Team.ID)
	} else {
		team, err = datastore.UpdateTeam(ctx, req.Team)
	}
	if err != nil {
		log.Warningf(ctx, "api.UpdateTeam unable to save team: %v", err)
		return nil, fmt.Errorf("unable to save team")
	}

	return &TeamMessage{Team: team}, nil
}

type StringMessage struct {
	Token string `json:"token,omitempty"`
	Value string `json:"value"`
}

func SetNextDraft(ctx context.Context, req *StringMessage) (res *StringMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetNextDraft: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("you must be in the admins group to update the draft date")
	}

	date, err := time.Parse(time.RFC3339, req.Value)
	if err != nil {
		log.Warningf(ctx, "api.SetNextDraft unable to parse date: %v", err)
		return nil, fmt.Errorf("unable to parse date: %s", err.Error())
	}
	if _, err = datastore.UpdateDraftDate(ctx, date); err == nil {
		return &StringMessage{Value: date.Format(time.RFC3339)}, nil
	}
	return nil, err
}

func GetNextDraft(ctx context.Context, req *EmptyMessage) (res *StringMessage, err error) {
	date, err := datastore.GetDraftDate(ctx, time.Now())

	if err != nil {
		return nil, err
	}
	if date != nil {
		return &StringMessage{Value: date.Format(time.RFC3339)}, nil
	}
	return nil, nil
}

//
// Announcements
//

type StringsMessage struct {
	Token   string   `json:"token,omitempty"`
	Strings []string `json:"strings"`
}

func GetAnnouncements(ctx context.Context, req *TokenMessage) (res *StringsMessage, err error) {
	strs, err := sheets.ReadSpreadsheet(ctx, sheets.AnnouncementsURL)
	return &StringsMessage{Strings: strs}, err
}

// Schedule

type UserSchedule struct {
	Token    string   `json:"token,omitempty"`
	ID       string   `json:"id"`
	MatchID  string   `json:"match_id"`
	Dates    string   `json:"schedule_dates"`
	DateTime []string `json:"selected_dates"`
	//	Schedule  *datastore.ScheduleUserToMatches `json:"schedule"`
}

type UserScheduleResponce struct {
	Schedule string `json:"schedule_message"`
}

func SetUserSchedule(ctx context.Context, req *UserSchedule) (res *UserScheduleResponce, err error) {
	userData, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetUserSchedule: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	if len(req.DateTime) < 1 {
		log.Warningf(ctx, "api.SetUserSchedule: empty post")
		return nil, fmt.Errorf("empty post")
	}

	team, err := datastore.GetTeamsByUserID(ctx, userData.ID)
	if err != nil {
		log.Warningf(ctx, "api.SetUserSchedule error fetching teams: %v", err)
	}
	team_id := ""
	for i := range team {
		if team_id == "" {
			team_id = team[i].ID
		}
	}
	q := datastore.ScheduleUserToMatches{
		ID:       req.ID,
		UserID:   userData.ID,
		TeamID:   team_id,
		MatchID:  req.MatchID,
		Dates:    req.Dates,
		DateTime: req.DateTime,
	}

	err = datastore.SetUserSchedules(ctx, &q)
	if err != nil {
		log.Warningf(ctx, "api.SetUserSchedule error updating user schedule: %v", err)
		return nil, err
	}
	schedule.CheckScheduleMatchReady(ctx, req.ID)
	return &UserScheduleResponce{Schedule: "Schedule updated"}, err
}

type ScheduleMatchesResponce struct {
	ScheduledMatches []*schedule.ScheduleMatches `json:"scheduled"`
}

func GetScheduledMatches(ctx context.Context, req *TokenMessage) (res *ScheduleMatchesResponce, err error) {
	userData, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetUserSchedule: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	schedules, err := schedule.GetUserScheduledMatches(ctx, userData.ID)
	if err != nil {
		log.Warningf(ctx, "api.GetScheduledMatches error getting user schedule: %v", err)
		return nil, err
	}
	return &ScheduleMatchesResponce{ScheduledMatches: schedules}, nil
}

type UnscheduleMatcheResponce struct {
	Match *schedule.ScheduleMatches `json:"unscheduled"`
}

func GetUnscheduledMatch(ctx context.Context, req *TokenMessage) (res *UnscheduleMatcheResponce, err error) {
	userData, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetUserSchedule: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	schedule, err := schedule.GetFirstUnscheduledMatch(ctx, userData.ID)
	if err != nil {
		log.Warningf(ctx, "api.GetScheduledMatches error getting user schedule: %v", err)
		return nil, err
	}
	return &UnscheduleMatcheResponce{Match: schedule}, nil
}

func GenerateMatches(ctx context.Context, req *StringMessage) (res *StringMessage, err error) {
	userIDMsg, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetNextDraft: verify token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}

	if !userIDMsg.IsAdmin {
		return nil, fmt.Errorf("you must be in the admins group to generate matches")
	}
	match.GenerateMatches(ctx)
	return &StringMessage{Value: "matches generated"}, nil
}

func ScheduleCurrWeekMatches(ctx context.Context /*, req *StringMessage*/) (res *StringMessage, err error) {
	/*	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
			if err != nil {
				log.Warningf(ctx, "api.ScheduleCurrWeekMatches: token error: %v, ignoring on cron tasks", err)
		//		return nil, fmt.Errorf("token invalid: %s", req.Token)
			}
	*/
	schedule.MatchScheduleCurrWeek(ctx)
	return &StringMessage{Value: "matches scheduled"}, nil
}

// RIOT API block
func RiotCollectSummonerInfo(ctx context.Context /*, req *StringMessage*/) (res *StringMessage, err error) {
	/*	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
			if err != nil {
				log.Warningf(ctx, "api.ScheduleCurrWeekMatches: token error: %v, ignoring on cron tasks", err)
		//		return nil, fmt.Errorf("token invalid: %s", req.Token)
			}
	*/
	lolapi.CollectSummonersInfo(ctx)
	return &StringMessage{Value: "summoner info collected"}, nil
}

func RiotCollectChampions(ctx context.Context /*, req *StringMessage*/) (res *StringMessage, err error) {
	/*	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
			if err != nil {
				log.Warningf(ctx, "api.ScheduleCurrWeekMatches: token error: %v, ignoring on cron tasks", err)
		//		return nil, fmt.Errorf("token invalid: %s", req.Token)
			}
	*/
	lolapi.GetStaticChampion(ctx)
	return &StringMessage{Value: "champions info collected"}, nil
}

type ChampionsResponceMessage struct {
	Champions []*datastore.RiotChampionsShort `json:"champions"`
}

func GetChampions(ctx context.Context, req *TokenMessage) (res *ChampionsResponceMessage, err error) {
	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetChampions: token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	champions, err := datastore.GetChampions(ctx)
	if err != nil {
		log.Warningf(ctx, "api.GetChampion: catch error: %v", err)
		return nil, fmt.Errorf("datastore error: %s", err)
	}
	return &ChampionsResponceMessage{Champions: champions}, nil
}

type BattleStatsUrl struct {
	Token     string `json:"token,omitempty"`
	ID        string `json:"id"`
	MatchID   string `json:"match_id"`
	BattleUrl string `json:"battle_url"`
}

type ChampionsSelectMessage struct {
	Champions *lolapi.UrlStatsResult `json:"champions"`
}

func SetBattleUrl(ctx context.Context, req *BattleStatsUrl) (res *ChampionsSelectMessage, err error) {
	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetBattleUrl: token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	data, err := lolapi.BattleUrlStats(ctx, req.ID, req.BattleUrl)
	if err != nil {
		return nil, err
	}
	res = &ChampionsSelectMessage{Champions: data}
	return res, nil
}

type StatsRequest struct {
	Token      string            `json:"token,omitempty"`
	ID         string            `json:"id"`
	BattleUrl  string            `json:"battle_url"`
	Team1Names map[string]string `json:"team_names"`
	Team1Champ map[string]int    `json:"team_champs"`
	Team2Names map[string]string `json:"opponent_names"`
	Team2Champ map[string]int    `json:"opponent_champs"`
}

func SetBattleStats(ctx context.Context, req *StatsRequest) (res *StringMessage, err error) {
	_, err = VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.SetBattleStats: token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	err = lolapi.SetBattleStats(ctx, req.ID, req.BattleUrl, req.Team1Names, req.Team2Names, req.Team1Champ, req.Team2Champ)
	if err != nil {
		return nil, err
	}
	return &StringMessage{Value: "Stats data stored"}, nil
}

type StatsResponce struct {
	Stats *stats.TotalUserStats `json:"stats"`
}

func GetUserStats(ctx context.Context, req *TokenMessage) (res *StatsResponce, err error) {
	userData, err := VerifyToken(ctx, &TokenMessage{Token: req.Token})
	if err != nil {
		log.Warningf(ctx, "api.GetUserStats: token error: %v", err)
		return nil, fmt.Errorf("token invalid: %s", req.Token)
	}
	stats_data := stats.CalculateStats(ctx, userData.ID)
	res = &StatsResponce{Stats: stats_data}
	return res, nil
}
