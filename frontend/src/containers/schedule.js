import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import {	logout, fetchProfile, 
					fetchProfilesMap, fetchMyTeam, 
					setSchedules, fetchUserSchedules, 
					submitBattleUrl, sendMatchStats
				} from '../actions'

import Schedule from '../components/schedule'

class ScheduleController extends React.Component {
	constructor(props) {
		super(props)
		this.state = { initialized: false }
		if (this.props.userSchedules == null || this.props.userSchedules.scheduled == undefined){
//			this.props.fetchUserSchedules()
		}
	}

	componentWillMount() {
		const { userSchedules, profile, team, fetchAnnouncements,
						fetchProfile, fetchProfilesMap, fetchMyTeam, 
						setSchedules, fetchUserSchedules 
					} = this.props
		
		if (!profile) fetchProfile()
		if (!team) {
			fetchMyTeam()
			fetchProfilesMap()
		}
		if (!userSchedules) fetchUserSchedules()
		if (profile && userSchedules) this.setState({ initialized: true })
	}

	componentDidMount() {
		this.setState({ initialized: true })
	}

	render() {
		const { user, profilePending, profile, profileMap, 
						logout, team, setSchedules, userSchedules, 
						fetchUserSchedules, submitBattleUrl, championSelect, sendMatchStats,
						battleStatsurlErr
					} = this.props

		const { initialized } = this.state;

		if (!initialized || profilePending)	{
			return <div className="pre-loading"><div className="loading-spinner"></div></div>
		}
		
		return <Schedule
			user              = {user}
			profile           = {profile}
			profileMap        = {profileMap || {}}
			logout            = {logout} team = {team}
			setSchedules      = {setSchedules}
			userSchedules     = {userSchedules}
			submitBattleUrl   = {submitBattleUrl}
			championSelect    = {championSelect || {}}
			sendMatchStats    = {sendMatchStats}
			battleStatsurlErr = {battleStatsurlErr}
		/>
	}
}

ScheduleController.propTypes = {
	user               : PropTypes.object,
	profilePending     : PropTypes.bool.isRequired,
	profile            : PropTypes.object,
	logout             : PropTypes.func.isRequired,
	setSchedules       : PropTypes.func.isRequired,
	fetchUserSchedules : PropTypes.func.isRequired,
	submitBattleUrl    : PropTypes.func.isRequired,
	sendMatchStats     : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	user              : state.auth.user,
	profilePending    : state.profile.isPending,
	profile           : state.profile.profile,
	profileMap        : state.profile.byId,
	team              : state.teams.myTeam,
	userSchedules     : state.schedule.myschedule,
	championSelect    : state.battle_stats.champions,
	battleStatsurlErr : state.battle_stats.error,
})

const mapDispatchToProps = (dispatch) => ({
	fetchProfile       : () => dispatch(fetchProfile()),
	fetchProfilesMap   : () => dispatch(fetchProfilesMap()),
	fetchMyTeam        : () => dispatch(fetchMyTeam()),
	logout             : () => dispatch(logout()),
	setSchedules       : (id, match_id, schedule_list, schedule_dates) => dispatch(setSchedules({id, match_id, schedule_list, schedule_dates})),
	fetchUserSchedules : () => dispatch(fetchUserSchedules()),
	submitBattleUrl    : (id, match_id, battle_url) => dispatch(submitBattleUrl({id, match_id, battle_url})),
	sendMatchStats    : ( id, battle_url, team_names, team_champs, opponent_names, opponent_champs ) => dispatch(sendMatchStats({ id, battle_url, team_names, team_champs, opponent_names, opponent_champs })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleController)
