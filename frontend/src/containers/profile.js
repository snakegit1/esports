import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

import { logout, fetchProfile, updateProfile, profileRequestStep, profileDismissError,
         fetchPaymentConfig, fetchPayment, submitPayment } from '../actions'
import TeamPlacementInfo from '../components/team_placement_info'
import Payment from '../containers/payment'
import ProfilePreferences from '../components/profile_preferences'
import EarnMoney from '../components/earn_money'
import RegistrationLayout from '../components/registration_layout'


function getMaxStep(profile, card) {
  if (!profile) return 2
  if (!profile.primary_positions || profile.primary_positions.length < 1) {
    return 2
  // } else if (!card) {
    // return 3
  } else if (profile.in_game_name === '') {
    return 3
  }
  return 4
}

class ProfileController extends React.Component {
  componentWillMount() {
    const { profile, card, fetchProfile, fetchPayment, fetchPaymentConfig } = this.props;
    if (!profile) {
      fetchProfile()
    }
    if (!card) {
      fetchPayment()
      fetchPaymentConfig()
    }
  }

  render() {
    const { user, profile, card, requestedStep, selectTab, updateProfile, dismissProfileError, logout } = this.props;
    const maxStep = getMaxStep(profile, card)
    const step = Math.min(requestedStep, maxStep)

    let prevTab = () => { selectTab(step-1)}
    let nextTab = () => { selectTab(step+1)}
    
    let child = <div>Loading...</div>

    if (profile) {
      switch (step) {
        case 2: child = <TeamPlacementInfo profile={profile} update={updateProfile} nextTab={nextTab} dismissError={dismissProfileError} />; break;
        // case 3: child = <Payment prevTab={prevTab} nextTab={nextTab} />; break;
        case 3: child = <ProfilePreferences profile={profile} update={updateProfile} prevTab={prevTab} nextTab={nextTab} dismissError={dismissProfileError} />; break;
        case 4: child = <EarnMoney profile={profile} prevTab={prevTab} />; break;
        default: child = <div>Uh oh, error occurred (Step: {step}). Please contact site administrator.</div>
      }
    }

    return <RegistrationLayout user={user} step={step} maxStep={maxStep} logout={logout} child={child} />
  }
}

ProfileController.propTypes = {
  user: PropTypes.object.isRequired,
  profile: PropTypes.object,
  card: PropTypes.object,
  paymentPending: PropTypes.bool.isRequired,
  requestedStep: PropTypes.number.isRequired,
  dismissProfileError: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  selectTab: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  subscription: state.payment.subscription,
  profile: state.profile.profile,
  card: state.payment.card,
  paymentPending: state.payment.isPending,
  requestedStep: state.profile.requestedStep,
  user: state.auth.user,
})

const mapDispatchToProps = (dispatch) => ({
  fetchProfile: () => dispatch(fetchProfile()),
  updateProfile: (profile) => dispatch(updateProfile({ profile })),
  dismissProfileError: () => dispatch(profileDismissError()),
  selectTab: (step) => dispatch(profileRequestStep(step)),
  fetchPaymentConfig: () => dispatch(fetchPaymentConfig()),
  fetchPayment: () => dispatch(fetchPayment()),
  sendPayment: (stripeToken) => dispatch(submitPayment({ stripeToken })),
  logout: () => dispatch(logout()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileController)
