import React from 'react'
import { PropTypes } from 'prop-types'

import RegisterFormActions from './register_form_actions'
//import FormSelect from './form_select'

import './profile_preferences.css'

class ProfilePreferences extends React.Component {
  constructor(props) {
    super(props)

    const { desired_outcome, in_game_name, practice, timezone, coaching, casting } = this.props.profile;
    this.state = {
      desired_outcome, in_game_name, practice, timezone, coaching, casting
    }

    this.submitForm = this.submitForm.bind(this)
    this.updateField = this.updateField.bind(this)
    this.updateString = this.updateString.bind(this)
    this.updateBool = this.updateBool.bind(this)
  }

  submitForm(e) {
    e.preventDefault();

    const { desired_outcome, in_game_name, practice, timezone, coaching, casting } = this.state;
    const newProfile = {
      ...this.props.profile,
      desired_outcome,
      in_game_name,
      practice,
      timezone,
      coaching,
      casting,
    }

    const { update, nextTab } = this.props
    update(newProfile)
    nextTab()
  }

  updateField(name, value) {
    this.setState({ [name]: value })
  }

  updateString(e) {
    let t = e.currentTarget
    this.updateField(t.name, t.value)
  }

  updateBool(e) {
    let t = e.currentTarget
    this.updateField(t.name, t.value.toLowerCase() === 'true')
  }

  render() {
    const { prevTab } = this.props
    const { desired_outcome, in_game_name, practice, timezone, coaching, casting } = this.state
    const nextButtonEnabled = desired_outcome !== '' && in_game_name !== '' && timezone !== ''

    let labelClick = (name, value) => { return () => {this.updateField(name, value)} }

    return (
      <div id="pp__vp">

        <form onSubmit={this.submitForm}>

          <div className="row question">
            <div className="prompt">What best describes your personal goal?</div>
            <div className="select-toolbar">
              <div className="col-sm-4 no-gutters">
                <input type="radio" name="desired_outcome" value="fun" checked={ desired_outcome === 'fun' } onChange={this.updateString} />
                <label className="block" onClick={labelClick('desired_outcome', 'fun')}>
                  <div className="title">Have Fun</div>
                  <div className="desc">Learn the team game and contribute to a positive community</div>
                </label>
              </div>
              <div className="col-sm-4 no-gutters">
                <input type="radio" name="desired_outcome" value="improve" checked={ desired_outcome === 'improve' } onChange={this.updateString} />
                <label className="block" onClick={labelClick('desired_outcome', 'improve')}>
                  <div className="title">Improve</div>
                  <div className="desc">Increase my flex/solo queue ranking</div>
                </label>
              </div>
              <div className="col-sm-4 no-gutters">
                <input type="radio" name="desired_outcome" value="pro" checked={ desired_outcome === 'pro' } onChange={this.updateString} />
                <label className="block" onClick={labelClick('desired_outcome', 'pro')}>
                  <div className="title">Get Paid</div>
                  <div className="desc">Scholarships, tournaments, professional contracts</div>
                </label>
              </div>
            </div>
          </div>

          <div className="row question">
            <div className="prompt">What IGN (in-game-name) will you be using this season?</div>
            <div className="input-group">
              <input type="text" name="in_game_name" className="form-control input-lg" aria-required="true" autoComplete="off" defaultValue={in_game_name} onChange={this.updateString} />
            </div>
          </div>

          <div className="row question">
            <div className="prompt">Are you interested in practicing?</div>
            <div className="select-toolbar">
              <div className="col-xs-6 no-gutters">
                <input type="radio" name="practice" value="true" checked={practice} onChange={this.updateBool} />
                <label className="block" onClick={labelClick('practice', true)}>
                  <div className="title">Yes</div>
                  <div className="desc">I'm available an interested in practicing with my team</div>
                </label>
              </div>
              <div className="col-xs-6 no-gutters">
                <input type="radio" name="practice" value="false" checked={!practice} onChange={this.updateBool} />
                <label className="block" onClick={labelClick('practice', false)}>
                  <div className="title">No</div>
                  <div className="desc">I'm unavailable or uninterested in practicing. I'll just show up for games.</div>
                </label>
              </div>
            </div>
          </div>

          <div className="row question">
            <div className="prompt">Games are scheduled on Tues/Thurs nights. What time works best for you?</div>
            <div>
              <div className="select-toolbar">
                <input type="radio" name="timezone" value="pacific" checked={timezone==='pacific'} onChange={this.updateString} />
                <label onClick={labelClick('timezone', 'pacific')}>
                  <span>6pm Pacific</span>
                </label>
                <input type="radio" name="timezone" value="central" checked={timezone==='central'} onChange={this.updateString} />
                <label onClick={labelClick('timezone', 'central')}>
                  <span>6pm Central</span>
                </label>
                <input type="radio" name="timezone" value="east" checked={timezone==='east'} onChange={this.updateString} />
                <label onClick={labelClick('timezone', 'east')}>
                  <span>6pm Eastern</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row question">
            <div className="prompt">Are you interested in joining our coaching program? You'll receive some training and then be let loose on a few teams in lower divisions</div>
            <div className="select-toolbar">
              <input type="radio" name="coaching" value="true" checked={coaching} onChange={this.updateBool} />
              <label onClick={labelClick('coaching', true)}>
                  <span>Yes, sounds fun</span>
              </label>
              <input type="radio" name="coaching" value="false" checked={!coaching} onChange={this.updateBool} />
              <label onClick={labelClick('coaching', false)}>
                <span>No thanks</span>
              </label>
            </div>
          </div>

          <div className="row question">
            <div className="prompt">Are you interested in joining our casting program? You will provide best-effort broadcast commentary and stream EDL games.</div>
            <div className="select-toolbar">
              <input type="radio" name="casting" value="true" checked={casting} onChange={this.updateBool} />
              <label onClick={labelClick('casting', true)}>
                <span>Yes, I'll try it</span>
              </label>
              <input type="radio" name="casting" value="false" checked={!casting} onChange={this.updateBool} />
              <label onClick={labelClick('casting', false)}>
                <span>No thanks</span>
              </label>
            </div>
          </div>

          <div className="row">
            <RegisterFormActions prevFn={prevTab} nextFn={nextButtonEnabled ? this.submitForm : null} />
          </div>

        </form>
      </div>
    )
  }
}

ProfilePreferences.propTypes = {
  profile: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  prevTab: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
}

export default ProfilePreferences
