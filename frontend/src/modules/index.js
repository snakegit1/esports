import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import announcements from './announcements'
import payment from './payment'
import profile from './profile'
import teams from './teams'
import schedule from './schedule'
import battle_stats from './battle_stats'
import user_stats from './user_stats'
import admin from './admin';

export default combineReducers({
	routing: routerReducer,
	auth,
	announcements,
	payment,
	profile,
	teams,
	schedule,
	battle_stats,
	user_stats,
	admin
})
