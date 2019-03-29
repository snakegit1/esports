import React from 'react'
import { PropTypes } from 'prop-types'

import RegisterFormActions from './register_form_actions'

import './team_placement_info.css'

class TeamPlacementInfo extends React.Component {
  constructor(props) {
    super(props)

    let { primary_positions, secondary_positions, rank_level, rank_tier } = this.props.profile;
    if (!primary_positions) primary_positions = []
    if (!secondary_positions) secondary_positions = []
    this.state = {
      primary_positions: primary_positions,
      secondary_positions: secondary_positions,
      rank_level,
      rank_tier,
      show_secondary: secondary_positions.length > 0,
    }
    this.submitForm = this.submitForm.bind(this)
    this.setPrimary = this.setPrimary.bind(this)
    this.toggleSecondary = this.toggleSecondary.bind(this)
    this.selectSecondary = this.selectSecondary.bind(this)
  }

  submitForm(e) {
    e.preventDefault();
    const newProfile = {
      ...this.props.profile,
      primary_positions: this.state.primary_positions,
      secondary_positions: this.state.secondary_positions,
      rank_level: this.refs.rank_level.value,
      rank_tier: parseInt(this.refs.rank_tier.value, 10),
    }

    const { update, nextTab } = this.props
    update(newProfile)
    nextTab()
  }

  setPrimary(val) {
    // if the chosen primary was a secondary position, remove it from secondary.
    const { secondary_positions } = this.state
    let index = secondary_positions.indexOf(val)
    if (index >= 0) {
      secondary_positions.splice(index, 1);
    }

    this.setState({ ...this.state, secondary_positions, primary_positions: [val]})
  }

  toggleSecondary(val) {
    this.setState({ ...this.state, show_secondary: val, secondary_positions: (val ? this.state.secondary_positions : []) })
  }

  selectSecondary(val) {
    const { secondary_positions } = this.state;
    let index = secondary_positions.indexOf(val);
    if (index >= 0) {
      secondary_positions.splice(index, 1);
    } else {
      secondary_positions.push(val)
    }
    this.setState({ ...this.state, secondary_positions })
  }

  render() {
    const { primary_positions, show_secondary, secondary_positions, rank_level, rank_tier } = this.state;
    let primary = candidate => (primary_positions.indexOf(candidate) >= 0)
    let secondary = candidate => (secondary_positions.indexOf(candidate) >= 0)

    let positions = ['Top', 'Mid', 'Jungle', 'Support', 'ADC']
    let primaryRadios = positions.map((e, i) => {
      let val = e.toLowerCase()
      return (
        <span key={i}>
          <input type="radio" name="position-1" value={val} checked={primary(val)} onChange={() => {this.setPrimary(val)}} />
          <label onClick={() => {this.setPrimary(val)}}>{e}</label>
        </span>
      )
    })
    let secondaryRadios = positions.map((e, i) => {
      let val = e.toLowerCase()
      return (
        <span key={i}>
          <input type="checkbox" name="position-2" disabled={primary(val)} checked={!primary(val) && secondary(val)} onChange={() => {this.selectSecondary(val)}} />
          <label onClick={() => {this.selectSecondary(val)}}>{e}</label>
        </span>
      )
    })

    let nextButtonEnabled = primary_positions.length > 0 && (!show_secondary || secondary_positions.length > 0)

    return (
      <div id="tpi__vp">

        <form onSubmit={this.submitForm}>

          <section className="question">
            <div className="prompt">What position(s) would you most like to play this season?</div>
            <div className="select-toolbar">{primaryRadios}</div>
          </section>

          <section className="question">
            <div className="prompt">If needed, are you willing to play a different position?</div>
            <div className="select-toolbar">
              <input type="radio" name="other-position" value="yes" checked={show_secondary} onChange={() => this.toggleSecondary(true)} />
              <label onClick={() => this.toggleSecondary(true)}>Yes</label>
              <input type="radio" name="other-position" value="no" checked={!show_secondary} onChange={() => this.toggleSecondary(false)} />
              <label onClick={() => this.toggleSecondary(false)}>No</label>
            </div>
          </section>

          { show_secondary ?
          <section className="question">
            <div className="prompt">Which other position would you be willing to play?</div>
            <div className="select-toolbar">{secondaryRadios}</div>
          </section>
          : null }

          <section className="question">
            <div className="prompt">What rank best represents your skill-level at your best position?</div>
            <select ref="rank_level" defaultValue={rank_level}>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
              <option value="master">Master</option>
              <option value="challenger">Challenger</option>
            </select>

            <select ref="rank_tier" defaultValue={rank_tier}>
              <option value="1">I</option>
              <option value="2">II</option>
              <option value="3">III</option>
              <option value="4">IV</option>
              <option value="5">V</option>
            </select>
          </section>

          <div className="row">
            <RegisterFormActions nextFn={nextButtonEnabled ? this.submitForm : null } />
          </div>

        </form>          
      </div>
    )
  }
}

TeamPlacementInfo.propTypes = {
  profile: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  nextTab: PropTypes.func.isRequired,
}

export default TeamPlacementInfo
