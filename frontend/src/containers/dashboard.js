import React from 'react'
import { PropTypes } from 'prop-types'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { logout, fetchAnnouncements, fetchProfile, fetchProfilesMap, fetchPayment, fetchDraftDate, fetchMyTeam, fetchUnscheduledMatch } from '../actions'

import Dashboard from '../components/dashboard'

function isComplete(profile) {
  return profile && profile.in_game_name !== ''
}

class DashboardController extends React.Component {
  constructor(props) {
    super(props)
    this.state = { initialized: false }
/*	if (this.props.UnscheduleMatch == null || this.props.UnscheduleMatch.unscheduled == undefined){
		this.props.fetchUnscheduledMatch()
	}
	*/
  }

  componentWillMount() {
    const { UnscheduleMatch, profile, card, draftDate, announcements, team, fetchAnnouncements, fetchProfile, fetchProfilesMap, fetchPayment, fetchDraftDate, fetchMyTeam, fetchUnscheduledMatch } = this.props
    if (!profile) fetchProfile()
    if (!card) fetchPayment()
    if (!draftDate) fetchDraftDate()
    if (!announcements) fetchAnnouncements()
    if (!team) {
      fetchMyTeam()
      fetchProfilesMap()
    }
    if (!UnscheduleMatch) fetchUnscheduledMatch()

    // thie result of this setState will be seen by the initial render. However,
    // the props set by the actions in the above two-lines will not have been
    // set for initial render. So, if we didn't actually dispatch any actions,
    // we can consider ourselves up-to-date.
    // See: https://github.com/reactjs/react-redux/issues/210 for more context.
    // if (profile && card) this.setState({ initialized: true })
    if (profile) this.setState({ initialized: true })
  }

  componentDidMount() {
    this.setState({ initialized: true })
  }

  render () {
    const { announcements, user, profilePending, profile, profileMap, paymentPending, card, logout, draftDate, team, fetchUnscheduledMatch, UnscheduleMatch } = this.props;
    const { initialized } = this.state;

    if (!initialized || (paymentPending || profilePending)) return <div className="pre-loading"><div className="loading-spinner"></div></div>
    // if (!isComplete(profile) || !card) return <Redirect to='/register' />
    if (!isComplete(profile)) return <Redirect to='/register' />
    return <Dashboard announcements={announcements} user={user} profile={profile} profileMap={profileMap || {}} card={card} logout={logout} draftDate={draftDate} team={team} unscheduleMatch={UnscheduleMatch}/>
  }
}

DashboardController.propTypes = {
  user                 : PropTypes.object,
  profilePending       : PropTypes.bool.isRequired,
  profile              : PropTypes.object,
  payment              : PropTypes.object,
  paymentPending       : PropTypes.bool.isRequired,
  logout               : PropTypes.func.isRequired,
  fetchUnscheduledMatch : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user            : state.auth.user,
  profilePending  : state.profile.isPending,
  profile         : state.profile.profile,
  profileMap      : state.profile.byId,
  paymentPending  : state.payment.isPending,
  card            : state.payment.card,
  draftDate       : state.teams.draftDate,
  announcements   : state.announcements.announcements,
  team            : state.teams.myTeam,
  UnscheduleMatch : state.schedule.unscheduled,
})

const mapDispatchToProps = dispatch => ({
  fetchAnnouncements   : () => dispatch(fetchAnnouncements()),
  fetchProfile         : () => dispatch(fetchProfile()),
  fetchProfilesMap     : () => dispatch(fetchProfilesMap()),
  fetchPayment         : () => dispatch(fetchPayment()),
  fetchDraftDate       : () => dispatch(fetchDraftDate()),
  fetchMyTeam          : () => dispatch(fetchMyTeam()),
  fetchUnscheduledMatch : () => dispatch(fetchUnscheduledMatch()),
  logout               : () => dispatch(logout())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardController)
