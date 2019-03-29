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

import './stats.css'

const Field = ({className, value, desc}) => (
  <div className={"field text-center " + className}>
    <div className="number">{value}</div>
    <div className="desc">{desc}</div>
  </div>
)

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

class Stats extends React.Component {
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
    const { profile, user, logout, team, profileMap, user_stats } = this.props;
	let team_stats = null;
	let _stats = null;

	if(user_stats.stats != undefined){
		team_stats = Object.keys(user_stats.stats.team_stats).length > 0 ? user_stats.stats.team_stats : null;
		_stats = user_stats.stats.user_stats ? user_stats.stats.user_stats : null;
	}
	let TeamTableRow = '';
	if (team_stats) {
		TeamTableRow = team_stats
		//	.sort((a, b) => a.match_id > b.match_id)
			.map((e, i) => {
			return (
				<tr key={i} className="m-datatable__row m-datatable__row--even m-datatable__row--table">
					<td className="m-datatable__cell">{e.TeamName}</td>
					<td className="m-datatable__cell">{e.wins}/{e.Losses}</td>
					<td className="m-datatable__cell">{e.Kills}/{e.Deaths}/{e.Assissts}</td>
					<td className="m-datatable__cell">{e.Gold_10}</td>
					<td className="m-datatable__cell">{e.Gold_20}</td>
					<td className="m-datatable__cell">{e.Wards}</td>
				</tr>
			)
		})
	}

	let UserTableRow = '';
	if (_stats) {
		UserTableRow = _stats
		//	.sort((a, b) => a.match_id > b.match_id)
			.map((e, i) => {
			return (
				<tr key={i} className="m-datatable__row m-datatable__row--even m-datatable__row--table">
					<td className="m-datatable__cell">{e.UserName}</td>
					<td className="m-datatable__cell">{e.TeamName}</td>
					<td className="m-datatable__cell">{e.Kills}/{e.Deaths}/{e.Assissts}</td>
					<td className="m-datatable__cell">{e.Gold10}</td>
					<td className="m-datatable__cell">{e.Gold20}</td>
					<td className="m-datatable__cell">{e.Wards}</td>
				</tr>
			)
		})
	}

    return (
      <section id="stats__vp">
        { this.state.comingSoon ? <ComingSoon show={true} dismiss={this.hideComingSoon} /> : null }
        <div id="wrap">
          <div id="main" className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
            <Header crumbs={['Stats']} view="stats" name={user.email} logout={logout} isAdmin={user.is_admin}></Header>
            <Content>
              <div className="row">

                <div className="col-sm-6">
                  <Portlet>
					<PortletHead>
                      <PortletHeadCaption>Division Team Stats</PortletHeadCaption>
                    </PortletHead>
					<PortletBody>
						{ team_stats ? 
							<div className="m_datatable m-datatable m-datatable--default m-datatable--loaded">
							<table className="m-datatable__table m-datatable__table--table">
								<thead className="m-datatable__head m-datatable__head--table">
									<tr className="m-datatable__row m-datatable__row--table">
										<th className="m-datatable__cell m-datatable__cell--sort">Team</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Wins/Losses</th>
										<th className="m-datatable__cell m-datatable__cell--sort">KDA</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Gold at 10 mins</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Gold at 20 mins</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Wards per minute</th>
									</tr>
								</thead>
								<tbody className="m-datatable__body m-datatable__body--table">
									{TeamTableRow}
								</tbody>
							</table>
						</div>

						: <div>Team stats not found</div> }
					</PortletBody>
				  </Portlet>
		  		</div>
                <div className="col-sm-6">
                  <Portlet>
					<PortletHead>
                      <PortletHeadCaption>Individual Stats</PortletHeadCaption>
                    </PortletHead>
					<PortletBody>
						{ _stats ? 
						<div className="m_datatable m-datatable m-datatable--default m-datatable--loaded">
							<table className="m-datatable__table m-datatable__table--table">
								<thead className="m-datatable__head m-datatable__head--table">
									<tr className="m-datatable__row m-datatable__row--table">
										<th className="m-datatable__cell m-datatable__cell--sort">Member</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Team</th>
										<th className="m-datatable__cell m-datatable__cell--sort">KDA</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Gold at 10 mins</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Gold at 20 mins</th>
										<th className="m-datatable__cell m-datatable__cell--sort">Wards per minute</th>
									</tr>
								</thead>
								<tbody className="m-datatable__body m-datatable__body--table">
									{UserTableRow}
								</tbody>
							</table>
						</div>
						: <div>Individual stats not found</div> }
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

Stats.propTypes = {
	profile        : PropTypes.object.isRequired,
	profileMap     : PropTypes.object.isRequired,
	user           : PropTypes.object.isRequired,
	logout         : PropTypes.func.isRequired,
}

export default Stats
