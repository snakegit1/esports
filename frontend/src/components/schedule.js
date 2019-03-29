import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import Modal from './modal'

import BreadCrumbs from './breadcrumbs'
import Header from './header'
import Content from './uielements/content'
import Widget from './uielements/widget'
import Portlet from './uielements/portlet/portlet'
import PortletHead from './uielements/portlet/portletHead'
import PortletHeadCaption from './uielements/portlet/portletHeadCaption'
import PortletHeadTools from './uielements/portlet/portletHeadTools'
import PortletBody from './uielements/portlet/portletBody'
import { sendUserSchedulesRequest } from '../actions'


import ScheduleModal from './modals/schedule_modal'
import FinishBattleModal from './modals/finish_battle_modal'

import './schedule.css'

const Field = ({ className, value, desc }) => (
	<div className={"field text-center " + className}>
		<div className="number">{value}</div>
		<div className="desc">{desc}</div>
	</div>
)

const Panel = ({ children, title, type }) => (
	<div className={"panel " + (type ? type : 'panel-default')}>
		<div className="panel-heading">
			<h3 className="panel-title">{title}</h3>
		</div>
		<div className="panel-body">
			{children}
		</div>
	</div>
)

const Team = ({ team, profileMap }) => {
	let cls = 'col-xs-6'

	if (!team) {
		team = { user_ids: [], name: 'unassigned', region: 'unassigned', division: 'unassigned' }
		cls += ' quiet'
	}

	const teammates = team.user_ids.map((id, i) => (
		<span key={i} className="teammate">{(profileMap[id] || { in_game_name: '?' }).in_game_name},</span>
	))

	return (
		<div className="row team">
			<div className="col-xs-6">Team:</div>
			<div className={cls}>{team.name}</div>
			<div className="col-xs-6">Region:</div>
			<div className={cls}>{team.region}</div>
			<div className="col-xs-6">Division:</div>
			<div className={cls}>{team.division}</div>
			<div className="col-xs-6">Players:</div>
			<div className={cls}>{teammates}</div>
		</div>
	)
}

Team.propTypes = {
	team: PropTypes.object,
	profileMap: PropTypes.object.isRequired,
}

class Schedule extends React.Component {
	constructor(props) {
		super(props)
		this.state = { schedulingMatch: null }
		this.state = { finishingBattle: null }
	}
	handleScheduleMatch(e, schedule) {
		e.preventDefault()
		this.setState({ schedulingMatch: schedule })
	}
	handleFinishBattle(e, battle) {
		e.preventDefault()
		this.setState({ finishingBattle: battle })
	}
	render() {
		const { profile, user, logout, team, profileMap, setSchedules, userSchedules, submitBattleUrl, championSelect, sendMatchStats, battleStatsurlErr } = this.props

		let scheduleTableRow = '';

		if (this.props.userSchedules && this.props.userSchedules.scheduled) {
			scheduleTableRow = this.props.userSchedules.scheduled
				.sort((a, b) => a.match_id > b.match_id)
				.map((e, i) => {
				let date_time = 'Not Yet Scheduled';
				if (e.match_dates != ''){
					date_time = e.match_dates;
				}
				return (
					<tr key={i} className="m-datatable__row m-datatable__row--even m-datatable__row--table">
						<td className="m-datatable__cell">{e.match_id}</td>
						<td className="m-datatable__cell">{e.dates}</td>
						<td className="m-datatable__cell">{e.opponent}</td>
						<td className="m-datatable__cell">{date_time}</td>
						<td className="m-datatable__cell">
							<button
								className = "btn btn-primary btn-sm m--margin-right-5"
								disabled  = {!(e.date_time.length < 1 && e.opponent != 'Not Yet Selected')}
								onClick   = {(t) => this.handleScheduleMatch(t, e)}
							>Schedule
							</button>
							<button
								className = "btn btn-primary btn-sm m--margin-right-5"
								disabled  = {(date_time == 'Not Yet Scheduled')}
								onClick   = {(t) => this.handleFinishBattle(t, e)}
							>End game
							</button>
					{/*<button
								className = "btn btn-primary btn-sm m--margin-right-5"
								onClick   = {(t) => this.handleFinishBattle(t, e)}
							>End game 2
							</button>
							*/}
						</td>
					</tr>
				)
			})

		}

		return (
			<section id="schedule__vp">
				<div id="wrap">
					<div id="main" className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
						<Header
							crumbs  = {['Schedule']}
							view    = "schedule"
							name    = {user.email}
							logout  = {logout}
							isAdmin = {user.is_admin}>
						</Header>
						<Content>
							<div className="row">
								<div className="col-sm-12">

									<Portlet>
										{/* loading ? <div className="pre-loading"><div className="loading-spinner"></div></div> : null */}
										<PortletHead>
											<PortletHeadCaption>
												Upcoming matches
											</PortletHeadCaption>
											<PortletHeadTools></PortletHeadTools>
										</PortletHead>
										<PortletBody>
											{this.state.schedulingMatch ?
												<ScheduleModal
													schedule     = {this.state.schedulingMatch}
													cancelFn     = {() => this.setState({ schedulingMatch: null })}
													saveFn       = {this.props.updateScheduler}
													setSchedules = {setSchedules}
													MatchId      = {this.state.schedulingMatch.match_id}
													ID           = {this.state.schedulingMatch.id}
												/>
												: null}
											{this.state.finishingBattle ?
												<FinishBattleModal
													battleInfo     = {this.state.finishingBattle}
													battleStats    = {submitBattleUrl}
													sendMatchStats = {sendMatchStats}
													cancelFn       = {() => this.setState({ finishingBattle: null })}
													MatchId        = {this.state.finishingBattle.match_id}
													ID             = {this.state.finishingBattle.id}
													championSelect = {championSelect}
													battleStatsurlErr = {battleStatsurlErr}
												/>
												: null}

											<div className="m_datatable m-datatable m-datatable--default m-datatable--loaded">
												<table className="m-datatable__table m-datatable__table--table">
													<thead className="m-datatable__head m-datatable__head--table">
														<tr className="m-datatable__row m-datatable__row--table">
															<th className="m-datatable__cell m-datatable__cell--sort">Match #</th>
															<th className="m-datatable__cell m-datatable__cell--sort">Dates</th>
															<th className="m-datatable__cell m-datatable__cell--sort">Opponent</th>
															<th className="m-datatable__cell m-datatable__cell--sort">Scheduled</th>
															<th className="m-datatable__cell m-datatable__cell--sort">Actions</th>
														</tr>
													</thead>
													<tbody className="m-datatable__body m-datatable__body--table">
														{scheduleTableRow}
													</tbody>
												</table>
											</div>
										</PortletBody>
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
												<div className="col-xs-6">Time Zone:</div>
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

Schedule.propTypes = {
	profile         : PropTypes.object.isRequired,
	profileMap      : PropTypes.object.isRequired,
	user            : PropTypes.object.isRequired,
	logout          : PropTypes.func.isRequired,
	submitBattleUrl : PropTypes.func.isRequired,
	championSelect  : PropTypes.object,
}

export default Schedule
