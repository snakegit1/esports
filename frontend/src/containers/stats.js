import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { logout, fetchProfile, fetchProfilesMap, fetchMyTeam, getUserStats } from '../actions'
import Stats from '../components/stats'

class StatsController extends React.Component {
	constructor(props) {
		super(props)
		this.state = { initialized: false }
	}

	componentWillMount() {
		const { profile, team, fetchProfile, fetchProfilesMap, fetchMyTeam, getUserStats, user_stats } = this.props
		if (!profile) fetchProfile()
		if (!team) {
			fetchMyTeam()
			fetchProfilesMap()
		}
		if (Object.keys(user_stats).length < 1) getUserStats()
		if (profile && user_stats) this.setState({ initialized: true })
	}

	componentDidMount() {
		this.setState({ initialized: true })
	}


	render() {
		const { user, profilePending, profile, profileMap, logout, team, user_stats } = this.props
		const { initialized } = this.state;
		if (!initialized || profilePending) return <div className="pre-loading"><div className="loading-spinner"></div></div>

		return <Stats user={user} profile={profile} profileMap={profileMap || {}} logout={logout} team={team} user_stats={user_stats} />
	}
}

StatsController.propTypes = {
	user           : PropTypes.object,
	profilePending : PropTypes.bool.isRequired,
	profile        : PropTypes.object,
	user_stats     : PropTypes.object,
	logout         : PropTypes.func.isRequired,
	getUserStats   : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	user           : state.auth.user,
	profilePending : state.profile.isPending,
	profile        : state.profile.profile,
	profileMap     : state.profile.byId,
	team           : state.teams.myTeam,
	user_stats     : state.user_stats.user_stats,
})

const mapDispatchToProps = (dispatch) => ({
	fetchProfile     : () => dispatch(fetchProfile()),
	fetchProfilesMap : () => dispatch(fetchProfilesMap()),
	fetchMyTeam      : () => dispatch(fetchMyTeam()),
	getUserStats     : () => dispatch(getUserStats()),
	logout           : () => dispatch(logout())
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StatsController)
