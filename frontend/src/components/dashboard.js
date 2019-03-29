import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'

import BreadCrumbs from './breadcrumbs'
import Header from './header'
import Content from './uielements/content'
import Widget from './uielements/widget'
import Portlet from './uielements/portlet/portlet'
import PortletHead from './uielements/portlet/portletHead'
import PortletHeadCaption from './uielements/portlet/portletHeadCaption'
import PortletHeadTools from './uielements/portlet/portletHeadTools'

import PortletBody from './uielements/portlet/portletBody'
import Modal from './modal'

// import './dashboard.css'

const Field = ({className, value, desc}) => (
  <div className={"field text-center " + className}>
    <div className="number">{value}</div>
    <div className="desc">{desc}</div>
  </div>
)

class Countdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = { tick: 0, date: props.date }
    this.timer = undefined
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({ tick : (this.state.tick + 1) % 10 });
  }

  render() {
    const { date } = this.state

    let endMs = date.getTime()
    let nowMs = (new Date()).getTime()

    let diffSec = (endMs - nowMs)/1000
    if (diffSec <= 0) return <div>--</div>

    let numDays = parseInt(diffSec / (60 * 60 * 24), 10)
    diffSec -= numDays * 60 * 60 * 24

    let numHours = parseInt(diffSec / (60 * 60), 10)
    diffSec -= numHours * 60 * 60

    let numMin = parseInt(diffSec / 60, 10)

    return (
      <div className="countdown row">
        <Field className="days col-xs-4" value={numDays} desc="Days" />
        <Field className="hours col-xs-4" value={numHours} desc="Hours" />
        <Field className="minutes col-xs-4" value={numMin} desc="Minutes" />
      </div>
    )
  }
}

Countdown.propTypes = {
  date: PropTypes.object.isRequired,
}

const Panel = ({children, title, type}) => (
  <div className={"panel " + (type ? type : 'panel-default')}>
    <div className="panel-heading">
      <h3 className="panel-title">{title}</h3>
    </div>
    <div className="panel-body">
      {children}
    </div>
  </div>
)

const ComingSoon = ({dismiss}) => (
  <Modal show={true}>
    <div id="csmod__vp" className="modal-content panel b-a">
      <div className="modal-header">
        <h4 className="modal-title">Coming Soon!</h4>
      </div>
      <div className="modal-body">
        Thanks for your patience.
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={dismiss}>Okay</button>
      </div>
    </div>
  </Modal>
)

const Team = ({ team, profileMap }) => {
  let cls = 'col-xs-6'

  if (!team) {
    team = { user_ids: [], name: 'unassigned', region: 'unassigned', division: 'unassigned' }
    cls += ' quiet'
  }

  const teammates = team.user_ids.map((id, i) => (
    <span key={i} className="teammate">{(profileMap[id] || {in_game_name: '?'}).in_game_name},</span>
  ))

  return (
    <div className="row team">
      <div className="col-xs-6">Team:</div>
      <div className={cls}>{ team.name }</div>
      <div className="col-xs-6">Region:</div>
      <div className={cls}>{ team.region }</div>
      <div className="col-xs-6">Division:</div>
      <div className={cls}>{ team.division }</div>
      <div className="col-xs-6">Players:</div>
      <div className={cls}>{ teammates }</div>
    </div>
  )
}

Team.propTypes = {
  team: PropTypes.object,
  profileMap: PropTypes.object.isRequired,
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { comingSoon: false }
    this.showComingSoon = this.showComingSoon.bind(this)
    this.hideComingSoon = this.hideComingSoon.bind(this)
  }

  showComingSoon(e) {
    if (e) e.preventDefault()
    this.setState({ comingSoon: true })
  }

  hideComingSoon(e) {
    if (e) e.preventDefault()
    this.setState({ comingSoon: false })
  }

  render() {
    const { announcements, profile, user, logout, draftDate, team, profileMap, unscheduleMatch} = this.props
    const date = draftDate ? new Date(draftDate) : null
    const unscheduledMatch = unscheduleMatch ? unscheduleMatch.unscheduled : null

    return (
      <section id="dash__vp">
        { this.state.comingSoon ? <ComingSoon show={true} dismiss={this.hideComingSoon} /> : null }
        <div id="wrap">
          <div id="main" className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
            <Header crumbs={['Dashboard']} view="dashboard" name={user.email} logout={logout} isAdmin={user.is_admin} ></Header>
            <Content>
              <div className="row">
                <div className="col-sm-12">
                  { (announcements || []).map((a, i) => (
                    <div key={i} className="alert alert-brand alert-dismissible fade show m-alert m-alert--square m-alert--air" role="alert">
                      <i className="fa fa-info-circle m--padding-right-5" aria-hidden="true"></i> {a}
                    </div>
                  )) }
                </div>

                <div className="col-sm-5">
		  { unscheduledMatch ? <Portlet>
					  <Widget id="schedule-availability">
						  <h5 className="m--margin-bottom-15">Availability</h5>
						  <p>Input your availability against "{unscheduledMatch.opponent}" for the week of ({unscheduledMatch.dates})</p>
                          <Link to="/schedule" className="btn btn-brand m-btn btn-sm m-btn--pill" rel="noopener noreferrer">
                            <span>
                              <span>Schedule</span>
                            </span>
                          </Link>
					  </Widget>
                  </Portlet> : '' }
                
                  <Portlet>
                    <PortletHead>
                      <PortletHeadCaption>Team Placement Countdown</PortletHeadCaption>
                    </PortletHead>
                    <Widget>
                      { date ? <Countdown date={date} /> : 'No draft currently scheduled' }
                    </Widget>
                  </Portlet>
                </div>
                <div className="col-sm-7">
                  <Portlet>
                    <Widget id="chat-widget">
                      <h5 className="m--margin-bottom-15">Chat
                        <a href="https://overtone.app/dashboard" target="_blank" rel="noopener noreferrer" className="btn btn-brand m-btn btn-sm m-btn--pill m--margin-left-20">
                          OPEN CHAT
                        </a>
                      </h5>
                      <p>
                        Login to chat with your team and the entire esportsleague community.
                        If you haven't yet received an email for access to Overtone, please reach out to the support team.
                      </p>
                    </Widget>
                  </Portlet>
                </div>
                <div className="col-sm-6">
                  <Portlet>

                    <PortletHead>
                      <PortletHeadCaption>My Profile</PortletHeadCaption>
                      <PortletHeadTools>
                      <ul className="m-portlet__nav">
                        <li className="m-portlet__nav-item">
                          <Link to="/register" className="btn btn-secondary m-btn m-btn--custom m-btn--pill">
                            <span>
                              <span>Edit</span>
                            </span>
                          </Link>
                        </li>
                      </ul>
                      </PortletHeadTools>
                    </PortletHead>

                    <Widget>
                      <div className="row profile">
                        <div className="col-xs-6">Goal:</div>
                        <div className="col-xs-6">{profile.desired_outcome}</div>
                        <div className="col-xs-6">Position:</div>
                        <div className="col-xs-6">{profile.primary_positions[0]}</div>
                        <div className="col-xs-6">Practice:</div>
                        <div className="col-xs-6">{profile.practice ? 'yes' : 'no'}</div>
                        <div className="col-xs-6">Time Zone:</div>
                        <div className="col-xs-6">{profile.timezone}</div>
                        <div className="col-xs-6">Coaching:</div>
                        <div className="col-xs-6">{profile.coaching ? 'yes' : 'no'}</div>
                        <div className="col-xs-6">Casting:</div>
                        <div className="col-xs-6">{profile.casting ? 'yes' : 'no'}</div>
                      </div>
                    </Widget>
                  </Portlet>
                </div>
                <div className="col-sm-6">
                  <Portlet>
                    <PortletHead>
                      <PortletHeadCaption>Current Team</PortletHeadCaption>
                    </PortletHead>
                    <Widget>
                    <Team team={team} profileMap={profileMap} />
                    </Widget>
                  </Portlet>
                </div>
              </div>
            </Content>
          </div>
        </div>
      </section>
    )
  }
}

Dashboard.propTypes = {
  announcements: PropTypes.array,
  profile: PropTypes.object.isRequired,
  profileMap: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  draftDate: PropTypes.string,
  unscheduleMatch: PropTypes.object,
  logout: PropTypes.func.isRequired,
}

export default Dashboard
