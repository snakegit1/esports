import axios from 'axios';  

import { apiUrl } from './env'

export const AUTH_SENT               = 'AUTH_SENT'
export const AUTH_RECEIVED           = 'AUTH_RECEIVED'
export const AUTH_DISMISS_ERROR      = 'AUTH_DISMISS_ERROR'

export const ANNOUNCEMENTS_PENDING   = 'AUTH_PENDING'
export const ANNOUNCEMENTS_RECEIVED  = 'ANNOUNCEMENTS_RECEIVED'

export const PROFILE_PENDING         = 'PROFILE_PENDING'
export const PROFILE_RECEIVED        = 'PROFILE_RECEIVED'
export const PROFILES_MAP_RECEIVED   = 'PROFILES_MAP_RECEIVED'
export const PROFILE_ERROR           = 'PROFILE_ERROR'
export const PROFILE_STEP_REQUESTED  = 'PROFILE_STEP_REQUESTED'
export const PROFILE_DISMISS_ERROR   = 'PROFILE_DISMISS_ERROR'

export const PAYMENT_PENDING         = 'PAYMENT_PENDING'
export const PAYMENT_RECEIVED        = 'PAYMENT_RECEIVED'
export const PAYMENT_ERROR           = 'PAYMENT_ERROR'
export const PAYMENT_CONFIG_RECEIVED = 'PAYMENT_CONFIG_RECEIVED'

export const DRAFT_DATE_PENDING      = 'DRAFT_DATE_PENDING'
export const DRAFT_DATE_RECEIVED     = 'DRAFT_DATE_RECEIVED'
export const TEAMS_PENDING           = 'TEAMS_PENDING'
export const TEAMS_ERROR             = 'TEAMS_ERROR'
export const TEAMS_RECEIVED          = 'TEAMS_RECEIVED'

export const SCHEDULE_PENDING        = 'SCHEDULE_PENDING'
export const SCHEDULE_RECEIVED       = 'SCHEDULE_RECEIVED'
export const UNSCHEDULE_RECEIVED     = 'UNSCHEDULE_RECEIVED'

export const BATTLE_PENDING          = 'BATTLE_PENDING'
export const BATTLE_RECEIVED         = 'BATTLE_RECEIVED'
export const BATTLE_ERROR            = 'BATTLE_ERROR'

export const USER_STATS_PENDING      = 'USER_STATS_PENDING'
export const USER_STATS_RECEIVED     = 'USER_STATS_RECEIVED'
export const USER_STATS_ERROR        = 'USER_STATS_ERROR'

export const ADMIN_PENDING           = 'ADMIN_PENDING'
export const ADMIN_USERS_RECEIVED    = 'ADMIN_USERS_RECEIVED'
//
// AUTH
//

export function authValid(user) {
  return {
    type    : AUTH_RECEIVED,
    payload : { user }
  }
}

export function authInvalid(error) {
  return {
    type    : AUTH_RECEIVED,
    payload : { error }
  }
}

export function authDismissError() {
  return {
    type    : AUTH_DISMISS_ERROR,
  }
}

export function logout() {
  return dispatch => {
    dispatch(authValid(null))
    dispatch(profileReceived(null))
    dispatch(profilesMapReceived(null))
    dispatch(paymentReceived({}))
  }
}

export function sendTokenCheck(token) {
  return dispatch => {
    if (!token) token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/user/verify`, { token })
      .then(response => {
        let res = response.data;
        if (res.error) dispatch(authInvalid(res.error));
        else dispatch(authValid(res.data));
      })
      .catch((error) => {
        dispatch(authInvalid(error));
      });
  }
}

export function sendResetPassword({ email }) {
  return dispatch => {
    dispatch({ type: AUTH_SENT })

    axios.post(`${apiUrl()}/api/v1/user/resetpassword`, { email })
      .then(response => {
        let res = response.data;
        if (res.error) dispatch(authInvalid(res.error));
        else dispatch(authInvalid(null));
      })
      .catch((error) => {
        dispatch(authInvalid(error));
      });
  }
}

export function sendAuthRequest({ email, password }) {
  return dispatch => {
    dispatch({ type: AUTH_SENT });

    axios.post(`${apiUrl()}/api/v1/user/login`, { email, password })
      .then(response => {
        let res = response.data;
        if (res.error) dispatch(authInvalid(res.error));
        else dispatch(authValid(res.data));
      })
      .catch((error) => {
        dispatch(authInvalid(error));
      });
  }
}

export function sendCreateAccount({ email, password }) {
  return dispatch => {
    dispatch({ type: AUTH_SENT });

    axios.post(`${apiUrl()}/api/v1/user/create`, { email, password })
      .then(response => {
        let res = response.data;
        if (res.error) dispatch(authInvalid(res.error));
        else dispatch(authValid(res.data));
      })
      .catch((error) => {
        dispatch(authInvalid(error));
      });
  }
}

/*
 * Schedules
*/

export function scheduleReceived(schedules) {
  return {
    type    : SCHEDULE_RECEIVED,
    payload : schedules,
  }
}

export function unscheduleReceived(data) {
  return {
    type    : UNSCHEDULE_RECEIVED,
    payload : data,
  }
}

export function setSchedules({ id, match_id, schedule_list, schedule_dates }) {
  return dispatch => {
    dispatch({ type: SCHEDULE_PENDING });
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/user/match-scheduling`, { token, id: id, match_id: match_id, schedule_dates: schedule_dates, selected_dates: schedule_list.split(',') })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        else dispatch(fetchUserSchedules());
	  })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function fetchUserSchedules() {
  
  return dispatch => {
    dispatch({ type: SCHEDULE_PENDING });

    let token = getLocalToken()

    axios.post(`${apiUrl()}/api/v1/user/match-scheduled`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        else dispatch(scheduleReceived(res.data));
       
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function fetchUnscheduledMatch() {
  return dispatch => {
    dispatch({ type: SCHEDULE_PENDING });

    let token = getLocalToken()

    axios.post(`${apiUrl()}/api/v1/user/match-unscheduled`, { token })
      .then(response => {
		  let res = response.data;
		  if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
		  if (res.error) console.log(res.error);
		  else dispatch(unscheduleReceived(res.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

// Matches
export function GenerateMatches(){
  return dispatch => {
    dispatch({ type: AUTH_SENT });
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/generate-matches`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        else console.log(res);
	  })
      .catch((error) => {
        console.error(error);
      });
  }
}

// Battle stats

export function championsReceived(data) {
  return {
    type    : BATTLE_RECEIVED,
    payload : data,
  }
}

export function championsError(error) {
  return {
    type: BATTLE_ERROR,
    payload: error,
  }
}

export function submitBattleUrl({ id, match_id, battle_url }){
  return dispatch => {
    dispatch({ type: BATTLE_PENDING });
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/battle/battle-url`, { token, id: id, match_id: match_id, battle_url: battle_url })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
		else if (res.error) dispatch(championsError(res.error))
        else dispatch(championsReceived(res.data));
	  })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function sendMatchStats({ id, battle_url, team_names, team_champs, opponent_names, opponent_champs }){
  return dispatch => {
    dispatch({ type: BATTLE_PENDING });
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/battle/set-battle-stats`, {
		token,
		id              : id,
		battle_url      : battle_url,
		team_names      : team_names,
		team_champs     : team_champs,
		opponent_names  : opponent_names,
		opponent_champs : opponent_champs,
	})
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        else{
			dispatch(getUserStats());
			dispatch(fetchUserSchedules());
		}
	  })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function UserStatsReceived(data) {
  return {
    type    : USER_STATS_RECEIVED,
    payload : data,
  }
}

export function UserStatsError(error) {
  return {
    type    : USER_STATS_ERROR,
    payload : error,
  }
}

export function getUserStats(){
  return dispatch => {
    dispatch({ type: USER_STATS_PENDING });
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/stats/get-user-stats`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
		else if (res.error) dispatch(UserStatsError(res.error))
        else dispatch(UserStatsReceived(res.data));
	  })
      .catch((error) => {
        console.error(error);
      });
  }
}
//
// ANNOUNCEMENTS
//

export function announcementsPending() {
  return {
    type    : ANNOUNCEMENTS_PENDING,
  }
}

export function announcementsReceived({ strings }) {
  return {
    type    : ANNOUNCEMENTS_RECEIVED,
    payload : strings,
  }
}


export function fetchAnnouncements() {
  return dispatch => {
    dispatch(announcementsPending())

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/announcements-get`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error));
        if (res.error) console.error(res.error);
        else dispatch(announcementsReceived(res.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
}


//
// PROFILE
//

export function profileReceived(profile) {
  return {
    type    : PROFILE_RECEIVED,
    payload : profile
  }
}

export function profilesMapReceived(map) {
  return {
    type    : PROFILES_MAP_RECEIVED,
    payload : map
  }
}

export function profileError(error) {
  return {
    type    : PROFILE_ERROR,
    payload : error
  }
}

export function profileDismissError() {
  return {
    type : PROFILE_DISMISS_ERROR,
  }
}

export function profileRequestStep(step = 1) {
  return {
    type    : PROFILE_STEP_REQUESTED,
    payload : step
  }
}

export function fetchProfile() {
  return dispatch => {
    dispatch({ type: PROFILE_PENDING })

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/profile-get`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(profileError(res.error));
        else dispatch(profileReceived(res.data.profile));
      })
      .catch((error) => {
        dispatch(profileError(error));
      });
  }
}

export function fetchProfilesMap() {
  return dispatch => {
    dispatch({ type: PROFILE_PENDING })

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/profiles-map`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(profileError(res.error));
        else dispatch(profilesMapReceived(res.data.map));
      })
      .catch((error) => {
        dispatch(profileError(error));
      });
  }
}


export function updateProfile({ profile }) {
  return dispatch => {
    dispatch({ type: PROFILE_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/profile-update`, { token, profile })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(profileError(res.error));
        else dispatch(profileReceived(res.data.profile));
      })
      .catch((error) => {
        dispatch(profileError(error));
      });
  }
}

//
// PAYMENT
//

export function paymentConfigReceived({ stripe_public_key }) {
  return {
    type: PAYMENT_CONFIG_RECEIVED,
    payload: { stripePublicKey: stripe_public_key },
  }
}

export function paymentError(error) {
  return {
    type: PAYMENT_ERROR,
    payload: error,
  }
}

export function paymentReceived({ card }) {
  return {
    type: PAYMENT_RECEIVED,
    payload: card,
  }
}

export function fetchPaymentConfig() {
  return dispatch => {
    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/payment-config`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) console.log('unexpected error', res.error);
        else dispatch(paymentConfigReceived(res.data));
      })
      .catch((error) => {
        console.log('unexpected error', error);
      });
  }
}

export function fetchPayment() {
  return dispatch => {
    dispatch({ type: PAYMENT_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/payment-get`, { token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(paymentError(res.error));
        else dispatch(paymentReceived(res.data || {}));
      })
      .catch((error) => {
        dispatch(paymentError(error));
      });
  } 
}

export function submitPayment({ stripeToken, couponCode }) {
  return dispatch => {
    dispatch({ type: PAYMENT_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/payment-add`, { token, stripe_token: stripeToken, coupon_code: couponCode })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(paymentError(res.error));
        else dispatch(paymentReceived(res.data));
      })
      .catch((error) => {
        dispatch(paymentError(error));
      });
  } 
}

//
// teams
//

export function draftDateReceived({ value }) {
  return {
    type: DRAFT_DATE_RECEIVED,
    payload: value,
  }
}

export function teamsError(error) {
  return {
    type: TEAMS_ERROR,
    payload: error,
  }
}

export function teamsReceived({ teams, mine }) {
  return {
    type: TEAMS_RECEIVED,
    payload: { teams, mine },
  }
}

export function fetchDraftDate() {
  return dispatch => {
    dispatch({ type: DRAFT_DATE_PENDING });

    axios.post(`${apiUrl()}/api/v1/draftdate-get`, { })
      .then(response => {
        let res = response.data;
        if (res.error) console.log(res.error);
        else dispatch(draftDateReceived(res.data || {}));
      })
      .catch((error) => {
        console.log(error);
      });
  } 
}

export function updateDraftDate(dateStr) {
  return dispatch => {
    dispatch({ type: DRAFT_DATE_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/draftdate-update`, { value: dateStr, token: token })
      .then(response => {
        let res = response.data;
        if (res.error) console.log(res.error);
        else dispatch(draftDateReceived(res.data || {}));
      })
      .catch((error) => {
        console.log(error);
      });
  } 
}

export function fetchMyTeam() {
  return dispatch => {
    dispatch({ type: TEAMS_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/team-get`, { token: token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(teamsError(res.error));
        else {
          dispatch(teamsReceived({
            ...res.data,
            mine: true,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } 
}

export function fetchTeams({ limit = 50, offset = 0 }) {
  return dispatch => {
    dispatch({ type: TEAMS_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/teams-get`, { token: token, limit, offset })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(teamsError(res.error));
        else dispatch(teamsReceived(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } 
}

export function submitTeam(team) {
  return dispatch => {
    dispatch({ type: TEAMS_PENDING });

    let token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/team-update`, { team, token: token })
      .then(response => {
        let res = response.data;
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        if (res.error) dispatch(teamsError(res.error));
        else dispatch(teamsReceived(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } 
}

export function usersReceived(users) {
  return {
    type: TEAMS_RECEIVED,
    payload: users
  };
}

export function usersList() {
  return dispatch => {
    dispatch({ type: ADMIN_PENDING});
    const token = getLocalToken()
    axios.post(`${apiUrl()}/api/v1/admin/users`, { token: token })
      .then(response => {
        const res = response.data;
        console.log(res);
        if (res.error && isAuthError(res.error)) dispatch(authInvalid(res.error))
        else dispatch(usersReceived(res.data))
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export function scheduleCurrWeek() {
  return dispatch => {
    dispatch({type: ADMIN_PENDING});
    axios.get(`${apiUrl()}/api/v1/cron/schedule-matches`)
      .then(response => {
        console.log(response);
      })
  }
}

//
// util
//

function isAuthError(error = '') {
  return error.indexOf('token invalid') === 0
}

// this may be 'bad' (in the redux sense) but it's easier than having to write
// a mergeStateAndDispatch function every time we need to dispatch a 
// token-needing action.
function getLocalToken(key = 'user') {
  let ls = window.localStorage
  let strVal = ls.getItem(key)
  if (strVal) {
    let objVal = JSON.parse(strVal)
    if (objVal && objVal.token) return objVal.token
  }
  return ''
}
