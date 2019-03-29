import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'

import { logout, updateDraftDate, fetchProfilesMap, fetchTeams, submitTeam, GenerateMatches, usersList, scheduleCurrWeek } from '../actions'

import Modal from '../components/modal'
import Header from '../components/header'
import ContentWrapper from '../components/uielements/content'
import Widget from '../components/uielements/widget'
import Portlet from '../components/uielements/portlet/portlet'
import PortletHead from '../components/uielements/portlet/portletHead'
import PortletHeadCaption from '../components/uielements/portlet/portletHeadCaption'
import PortletHeadTools from '../components/uielements/portlet/portletHeadTools'

import PortletBody from '../components/uielements/portlet/portletBody'
import PortletFooter from '../components/uielements/portlet/portletFooter'



import '../components/admin.css'

// TODO: This template should be broken into 4 or 5 small components and moved into ../components, leaving
// only Admin probably.

//
//
//
const DraftDate = ({updateDraftDate}) => {
	let handleSubmitDraft = (e) => {
		e.preventDefault()
		if (this.date.value) {
			updateDraftDate(this.date.value + ':00-08:00')
		}
	}

	const tomorrow = new Date();
	tomorrow.setHours(tomorrow.getHours()+24);
	let def = tomorrow.toISOString().substr(0,16)

	return (
		<Portlet>
			<PortletHead>
				<PortletHeadCaption>
					Draft
				</PortletHeadCaption>
			</PortletHead>
			<PortletBody padding={false}>
				<Widget>
					<form className="m-form m-form--fit m-form--label-align-right" onSubmit={handleSubmitDraft}>
						<div className="form-group">
							<input type="datetime-local" className="form-control m-input m-input--square" ref={i => { this.date = i }} defaultValue={def} />
						</div>
						<button className="btn btn-block btn-primary full-width" type="submit">Set</button>
					</form>
				</Widget>
			</PortletBody>
		</Portlet>
	)
}


//
//
//
const getSuggestions = (profileMap, inputValue) => {
	inputValue = inputValue.trim().toLowerCase();

	if (inputValue.length === 0) return [];
	let res = [];

	for (var id in profileMap) {
		if (!profileMap.hasOwnProperty(id)) continue;
		const { in_game_name } = profileMap[id];
		let index = in_game_name.toLowerCase().indexOf(inputValue);
		if (index < 0) continue;

		let pre = <span key='0'>{in_game_name.slice(0, index)}</span>;
		let match = <span key='1' className='match'>{inputValue}</span>;
		let post = <span key='2'>{in_game_name.slice(index + inputValue.length, in_game_name.length)}</span>
		res.push({ in_game_name, id, display: [pre, match, post] })
	}

	return res;
};

const getSuggestionValue = suggestion => suggestion.in_game_name;

class UserIDSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: '', suggestions: [] };
	}

	renderSuggestion = suggestion => (<div>{suggestion.display}</div>);

	onChange = (event, { newValue }) => {
		this.setState({ value: newValue });
	};

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({ suggestions: getSuggestions(this.props.profileMap, value) });
	};

	onSuggestionsClearRequested = () => {
		this.setState({ suggestions: [] });
	};

	onSuggestionSelected = (e, {suggestion}) => {
		e.preventDefault();
		this.props.onSelect(suggestion);
		this.setState({ value: '' });
	};

	render() {
		const { value, suggestions } = this.state;

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: 'Type an in game name',
			className: 'form-control input-lg',
			value,
			onChange: this.onChange
		};

		return (
			<Autosuggest
				suggestions                 = {suggestions}
				onSuggestionsFetchRequested = {this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested = {this.onSuggestionsClearRequested}
				onSuggestionSelected        = {this.onSuggestionSelected}
				getSuggestionValue          = {getSuggestionValue}
				renderSuggestion            = {this.renderSuggestion}
				inputProps                  = {inputProps}
			/>
		);
	}
}

UserIDSearch.propTypes = {
	profileMap: PropTypes.object.isRequired,
}


//
//
//
const TeamForm = ({profileMap, team, showPlayers, update}) => {
	let handleSubmit = (e) => {
		e.preventDefault()
	}

	let handleChange = (e) => {
		update({
			...team,
			[e.target.name]: e.target.value,
		})
	}

	let handleRemove = (e, id) => {
		if (!window.confirm('Are you sure you want to remove this player?')) {
			return;
		}

		const index = (team.user_ids || []).indexOf(id)
		if (index < 0) {
			console.error('No id found in list:', id);
			return
		}

		team.user_ids.splice(index, 1);
		update(team);
	}

	let handleSelect = (item) => {
		const user_ids = team.user_ids || [];
		if (user_ids.indexOf(item.id) < 0) {
			user_ids.splice(0, 0, item.id);
			update({
				...team,
				user_ids,
			});
		}
	}

	let players = (team.user_ids || []).map((id, i) => (
		<button className="btn btn-primary" type="button" key={i} onClick={(e) => handleRemove(e, id)}>
			{ (profileMap[id] || {in_game_name: 'N/A'}).in_game_name}&nbsp;
			<span className="badge">X</span>
		</button>
	))

	return (
		<form id="teamform__vp" onSubmit={handleSubmit} >
			<div className="form-group">
				<span className="help-block">Team Name</span>
				<input type="text" name="name" className="form-control input-lg" placeholder="name" defaultValue={team.name} onChange={handleChange}/>
			</div>
			<div className="form-group">
				<span className="help-block">Team Region</span>
				<input type="text" name="region" className="form-control input-lg" placeholder="region" defaultValue={team.region} onChange={handleChange}/>
			</div>
			<div className="form-group">
				<span className="help-block">Team Division</span>
				<input type="text" name="division" className="form-control input-lg" placeholder="division" defaultValue={team.division} onChange={handleChange}/>
			</div>
			{ showPlayers ?
				<div className="form-group">
					<span className="help-block">Players</span>
					<div className="players">
						{ players }
					</div>
					<UserIDSearch profileMap={profileMap} onSelect={handleSelect} />
				</div>
				: null }
		</form>
	)
}

TeamForm.propTypes = {
	profileMap : PropTypes.object.isRequired,
	update     : PropTypes.func.isRequired,
}


//
//
//
class TeamEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team: props.team
		}
		this.updateState = this.updateState.bind(this);
		this.save = this.save.bind(this);
	}

	updateState(team) {
		this.setState({
			team: {
				...this.state.team,
				...team
			}
		})
	}

	save(e) {
		e.preventDefault();
		const { team } = this.state;
		if (!team.name || !team.region || !team.division) {
			alert("Name, Region, and Division are required.")
			return;
		}
		this.props.saveFn(this.state.team);
		this.props.cancelFn();
	}

	render() {
		const { team } = this.state;
		const { profileMap, cancelFn } = this.props;
		return (
			<Modal show={true} >
				<div id="teammodal__vp" className="modal-content panel b-a">
					<div className="modal-header">
						<h4 className="modal-title">{ `${team.id ? 'Edit' : 'Add'} Team `}</h4>
					</div>
					<div className="modal-body">
						<TeamForm showPlayers={true} team={team} profileMap={profileMap} update={this.updateState} />
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-default btn-sm" data-dismiss="modal" onClick={cancelFn}>Cancel</button>
						<button type="button" className="btn btn-primary btn-sm" data-dismiss="modal" onClick={this.save}>Save</button>
					</div>
				</div>
			</Modal>
		)
	}
}

TeamEdit.propTypes = {
	team       : PropTypes.object.isRequired,
	profileMap : PropTypes.object.isRequired,
}

//
//
//
class TeamsSection extends React.Component {
	constructor(props) {
		super(props)
		this.state = { editingTeam: null }
	}

	handleEditTeam(e, team) {
		e.preventDefault()
		this.setState({ editingTeam: team })
	}

	render() {
		const { teams, loading, updateTeam } = this.props

		const handleDeleteTeam = (e, id) => {
			e.preventDefault();
			if (window.confirm('Are you sure you want to delete this team?')) {
				updateTeam({ id });
			}
		}

		return (
			<Portlet>
			{ loading ? <div className="pre-loading"><div className="loading-spinner"></div></div> : null }

				<PortletHead>
					<PortletHeadCaption>
						Teams
					</PortletHeadCaption>
					<PortletHeadTools>
						<ul className="m-portlet__nav">
							<li className="m-portlet__nav-item">
								<button className="btn btn-secondary m-btn m-btn--custom m-btn--pill" onClick={(e) => this.handleEditTeam(e, {})}>
									<span>
										<span>Add Team</span>
									</span>
								</button>
							</li>
						</ul>
					</PortletHeadTools>
				</PortletHead>
				<PortletBody>
					{ this.state.editingTeam ?
						<TeamEdit team={this.state.editingTeam} profileMap={this.props.profileMap} cancelFn={() => this.setState({ editingTeam: null })} saveFn={this.props.updateTeam} />
						: null }
					<div className="m_datatable m-datatable m-datatable--default m-datatable--loaded">
						<table className="m-datatable__table">
							<thead className="m-datatable__head">
								<tr className="m-datatable__row">
									<th className="m-datatable__cell m-datatable__cell--sort">Name</th>
									<th className="m-datatable__cell m-datatable__cell--sort">Region</th>
									<th className="m-datatable__cell m-datatable__cell--sort">Division</th>
									<th className="m-datatable__cell m-datatable__cell--sort">Actions</th>
								</tr>
							</thead>
							<tbody className="m-datatable__body">
								{ (teams || []).map((t, i) => (
									<tr className="m-datatable__row m-datatable__row--even" key={i}>
										<td className="m-datatable__cell">{t.name}</td>
										<td className="m-datatable__cell">{t.region}</td>
										<td className="m-datatable__cell">{t.division}</td>
										<td className="m-datatable__cell">
											<a href={"/admin/team/" + t.id} className="btn btn-primary btn-sm m--margin-right-5" onClick={(e) => this.handleEditTeam(e, t)}>Edit</a>
											<a href="/delete" className="btn btn-danger btn-outline-brand btn-sm" onClick={(e) => handleDeleteTeam(e, t.id)}>Delete</a>
										</td>
									</tr>))
								}
							</tbody>
						</table>
					</div>
				</PortletBody>
			</Portlet>
		)
	}
}

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.refresh = this.refresh.bind(this);
		this.updateAndRefresh = this.updateAndRefresh.bind(this);
	}

	componentWillMount() {
		this.refresh()
	}

	refresh() {
		const { fetchTeams, fetchProfilesMap, fetchUsers } = this.props;
		fetchTeams(1000, 0)
		fetchProfilesMap()
	}

	handleGenerateMatches = (e) => {
		this.props.GenerateMatches()
	}

	scheduleMatches = () => {
		this.props.schedule()
	}

	getUsers = () => {
		this.props.fetchUsers()
	}

	updateAndRefresh(team) {
		this.props.updateTeam(team);
		window.setTimeout(this.refresh, 500) // hack
	}

	render() {
		const { profileMap, teams, teamsPending, logout , user, updateDraftDate, GenerateMatches } = this.props;
		let teams_available = false;
		if (teams.length < 4){
			teams_available = true;
		}

		return (
			<div>
				<Header crumbs={['Administration']} name={user.email} logout={logout} isAdmin={user.is_admin}></Header>
				<div id="admin__vp">
					<ContentWrapper>
						<div className="row">
							<div className="col-sm-8 col-sm-offset-2">
								<div className="row">
									<div className="col-sm-4">
										<DraftDate updateDraftDate={updateDraftDate} />
										<Portlet>
											<PortletHead>
												<PortletHeadCaption>Match</PortletHeadCaption>
											</PortletHead>
											<PortletBody padding={false}>
												<Widget>
												<button className="btn btn-secondary m-btn m-btn--custom m-btn--pill" onClick={(e) => this.handleGenerateMatches(e, {})} >
													<span>
														<span>Generate matches</span>
													</span>
												</button>
												<button style={{marginTop: "24px"}} className="btn btn-secondary m-btn m-btn--custom m-btn--pill" onClick={(e) => this.scheduleMatches()} >
													<span>
														<span>Schedule matches for next week</span>
													</span>
												</button>
												<button style={{marginTop: "24px", display: "none"}} className="btn btn-secondary m-btn m-btn--custom m-btn--pill" onClick={(e) => this.getUsers()} >
													<span>
														<span>Users</span>
													</span>
												</button>
												</Widget>
											</PortletBody>
										</Portlet>
									</div>
									<div className="col-sm-8">
										<TeamsSection teams={teams} loading={teamsPending} profileMap={profileMap} updateTeam={this.updateAndRefresh} />
									</div>
								</div>
							</div>
						</div>
					</ContentWrapper>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user         : state.auth.user,
	teams        : state.teams.teams,
	teamsPending : state.teams.teamsPending,
	profileMap   : state.profile.byId || {},
	users		 : state.admin.users
})

const mapDispatchToProps = dispatch => ({
	updateDraftDate  : (dateStr) => dispatch(updateDraftDate(dateStr)),
	updateTeam       : (team) => dispatch(submitTeam(team)),
	fetchTeams       : (limit, offset) => dispatch(fetchTeams({ limit, offset })),
	fetchProfilesMap : () => dispatch(fetchProfilesMap()),
	logout           : () => dispatch(logout()),
	GenerateMatches  : () => dispatch(GenerateMatches()),
	fetchUsers		 : () => dispatch(usersList()),
	schedule 		 : () => dispatch(scheduleCurrWeek()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
