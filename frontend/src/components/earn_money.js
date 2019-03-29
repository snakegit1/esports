import React from 'react';
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import ClipboardButton from 'react-clipboard.js'

import { webUrl } from '../env'
import RegisterFormActions from './register_form_actions'

import './earn_money.css'

class EarnMoney extends React.Component {
  constructor(props) {
    super(props)
    this.state = { copied: false }

    this.handleCopy = this.handleCopy.bind(this)
  }

  handleCopy() {
    this.setState({ copied: true })
  }

  render() {
    const { profile, prevTab } = this.props
    const { copied } = this.state
    const referUrl = webUrl() + "/register?r=" + (profile.referral_code)

    return (
      <div id="em__vp">

        <h3><strong>Congratulations</strong> - You're Registered</h3>

        <div className="refer text-center">
          <div className="m--margin-bottom-20">The EDL Affiliate program pays you to spread the word and refer new users. You'll receive $5 for each new user's 1st season and $3 for all subsequent seasons. If you are interested in becoming an EDL Affiliate sign up here: <a href="https://paykstrt.com/request/4807">https://paykstrt.com/request/4807</a></div>
        </div>

        <div className="action text-center">
          <Link to="/dashboard" className="btn btn-default">Go To My Dashboard</Link>
        </div>

        <div className="row">
          <RegisterFormActions prevFn={prevTab} />
        </div>
      </div>
    )
  }
}

EarnMoney.propTypes = {
  profile: PropTypes.object.isRequired,
  prevTab: PropTypes.func.isRequired,
}

export default EarnMoney
