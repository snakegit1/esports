import React from 'react'
import { PropTypes } from 'prop-types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Modal from '../modal'

import Portlet from '../uielements/portlet/portlet'
import PortletHead from '../uielements/portlet/portletHead'
import PortletHeadCaption from '../uielements/portlet/portletHeadCaption'
import PortletHeadTools from '../uielements/portlet/portletHeadTools'
import PortletBody from '../uielements/portlet/portletBody'


import MultiSelect from '../uielements/multiSelect'

import './modal.css'

const Select = ({optionname, options, handleSelect, selected}) => (
	<MultiSelect 
		initSelect       = {{
			name           : optionname,
			selectedOption : '',
			removeSelected : true,
			disabled       : false,
			stayOpen       : false,
			value          : selected,
			rtl            : false,
			placeholder    : 'Select champion',
			multi          : false,
			matchValue     : true,
			matchLabel     : false
		}}
		optionSelect     = {options}
		handlerFromModal = {handleSelect}
	/>
)

export default class FinishBattleModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tabIndex         : 0,
			ShowNextButton   : true,
			Loading          : false,
			optionSelect     : [],
			TeamInputs       : {},
			OpponentInputs   : {},
			TeamSelect       : {},
			OpponentSelect   : {},
			TabDisabled      : true,
			BattleUrl        : "",
			ErrorMsg         : "",
			isDisabledButton : true
		};
		this.battleStats = this.props.battleStats;
		this.sendStats = this.props.sendMatchStats;

		this.handleChangeInput         = this.handleChangeInput.bind(this);
		this.handleChangeOpponentInput = this.handleChangeOpponentInput.bind(this);
		this.handleValueSelect         = this.handleValueSelect.bind(this);
		this.handleOpponentSelect      = this.handleOpponentSelect.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if (this.state.optionSelect.length < 1 && (nextProps.championSelect.champions != undefined && nextProps.championSelect.champions.length > 0)){
			this.setState({
				tabIndex       : 1,
				optionSelect   : nextProps.championSelect.champions,
				TeamInputs     : nextProps.championSelect.team_players.team1,
				OpponentInputs : nextProps.championSelect.team_players.team2,
				ErrorMsg       : "",
				ShowNextButton : false,
				TabDisabled    : false,
				Loading        : false
			})
//			nextProps.battleStatsurlErr = ""
		}
		if (nextProps.battleStatsurlErr != undefined && nextProps.battleStatsurlErr != ""){
			this.setState({
//				ErrorMsg   : nextProps.battleStatsurlErr,
				Loading    : false
			})
		}
	}

	handleBattleUrl = (e, MatchId, ID) => {
		e.preventDefault();
		if(this.battle_url.value != ""){
			this.setState({
				BattleUrl : this.battle_url.value,
				ErrorMsg  : "",
				Loading   : true
			})
			this.battleStats(ID, MatchId, this.battle_url.value)
		}else{
			this.setState({
				ErrorMsg  : "Battle url empty",
			})
		}
	}

	handleSubmit=(e, MatchId, ID)=>{
		e.preventDefault();
		this.sendStats(ID, this.state.BattleUrl, this.state.TeamInputs, this.state.TeamSelect, this.state.OpponentInputs, this.state.OpponentSelect);
		this.props.cancelFn();
	}
	handleValueSelect=(e)=>{
		var fields = this.state.TeamSelect;
		fields[e.name] = e.val;
		this.setState({ TeamSelect: fields });
		if (Object.keys(this.state.TeamInputs).length > 0 && Object.keys(this.state.TeamSelect).length > 0){
			this.setState({isDisabledButton: false});
		}else{
			this.setState({isDisabledButton: true});
		}
	}

	handleOpponentSelect=(e)=>{
		var fields = this.state.OpponentSelect;
		fields[e.name] = e.val;
		this.setState({ OpponentSelect: fields });
		if (Object.keys(this.state.OpponentInputs).length > 0 && Object.keys(this.state.OpponentSelect).length > 0){
			this.setState({isDisabledButton: false});
		}
	}

	handleChangeInput (evt) {
		var form_fields = this.state.TeamInputs;
		form_fields[evt.target.name] = evt.target.value;
		this.setState({ TeamInputs: form_fields });
		if (Object.keys(this.state.TeamInputs).length > 0 && Object.keys(this.state.TeamSelect).length > 0){
			this.setState({isDisabledButton: false});
		}else{
			this.setState({isDisabledButton: true});
		}
	}
	
	handleChangeOpponentInput (evt) {
		var form_fields = this.state.OpponentInputs;
		form_fields[evt.target.name] = evt.target.value;
		this.setState({ OpponentInputs: form_fields });
		if (Object.keys(this.state.OpponentInputs).length > 0 && Object.keys(this.state.OpponentSelect).length > 0){
			this.setState({isDisabledButton: false});
		}
	}


	render() {
		const { battleInfo, cancelFn, MatchId, ID, battleStats, championSelect, sendMatchStats } = this.props;
		var staturl_opts = {}
		if (championSelect.length > 0){
			staturl_opts['readOnly'] = 'readOnly';
		}

		return (
			<Modal show={true}>
				<div id="mod__vp" className="modal-content panel b-a">
					<form onSubmit={(e) => this.handleSubmit(e, MatchId, ID)}>
						<div className="modal-header">
							<h4 className="modal-title">Finish game</h4>
						</div>
						<div className="modal-body">
							{ this.state.ErrorMsg ? <div className="error-msg">{this.state.ErrorMsg}</div> : null }
							<Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
								<TabList>
									<Tab>Battle url</Tab>
									<Tab disabled={this.state.TabDisabled}>Team1 players</Tab>
									<Tab disabled={this.state.TabDisabled}>Team2 players</Tab>
								</TabList>
								<TabPanel>
									<Portlet>
										<PortletBody>
											{ this.state.Loading ? <div className="pre-loading"><div className="loading-spinner"></div></div> : null }
											<input type="text" className="form-control input-lg" placeholder="Battle stats url" aria-required="true" autoComplete="off" ref={ input => { this.battle_url = input }} {...staturl_opts} defaultValue={this.state.BattleUrl}/>
										</PortletBody>
									</Portlet>
								</TabPanel>
								<TabPanel>
									<Portlet>
										<PortletBody>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="team_player1" 
														onChange={this.handleChangeInput} 
														defaultValue={this.state.TeamInputs.team_player1}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="team_player1" 
														options={this.state.optionSelect} 
														handleSelect={this.handleValueSelect} 
														selected={this.state.TeamSelect.team_player1}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="team_player2" 
														onChange={this.handleChangeInput}
														defaultValue={this.state.TeamInputs.team_player2}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="team_player2" 
														options={this.state.optionSelect} 
														handleSelect={this.handleValueSelect} 
														selected={this.state.TeamSelect.team_player2}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="team_player3" 
														onChange={this.handleChangeInput}
														defaultValue={this.state.TeamInputs.team_player3}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="team_player3" 
														options={this.state.optionSelect} 
														handleSelect={this.handleValueSelect}
														selected={this.state.TeamSelect.team_player3}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="team_player4" 
														onChange={this.handleChangeInput}
														defaultValue={this.state.TeamInputs.team_player4}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="team_player4" 
														options={this.state.optionSelect} 
														handleSelect={this.handleValueSelect} 
														selected={this.state.TeamSelect.team_player4}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="team_player5" 
														onChange={this.handleChangeInput}
														defaultValue={this.state.TeamInputs.team_player5}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="team_player5" 
														options={this.state.optionSelect} 
														handleSelect={this.handleValueSelect} 
														selected={this.state.TeamSelect.team_player5}
													/>
												</div>
											</div>
										</PortletBody>
									</Portlet>
								</TabPanel>
								<TabPanel>
									<Portlet>
										<PortletBody>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="opponent_player1" 
														onChange={this.handleChangeOpponentInput}
														defaultValue={this.state.OpponentInputs.opponent_player1}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="opponent_player1" 
														options={this.state.optionSelect} 
														handleSelect={this.handleOpponentSelect} 
														selected={this.state.OpponentSelect.opponent_player1}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="opponent_player2" 
														onChange={this.handleChangeOpponentInput}
														defaultValue={this.state.OpponentInputs.opponent_player2}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="opponent_player2" 
														options={this.state.optionSelect} 
														handleSelect={this.handleOpponentSelect} 
														selected={this.state.OpponentSelect.opponent_player2}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="opponent_player3" 
														onChange={this.handleChangeOpponentInput}
														defaultValue={this.state.OpponentInputs.opponent_player3}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="opponent_player3" 
														options={this.state.optionSelect} 
														handleSelect={this.handleOpponentSelect} 
														selected={this.state.OpponentSelect.opponent_player3}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="opponent_player4" 
														onChange={this.handleChangeOpponentInput}
														defaultValue={this.state.OpponentInputs.opponent_player4}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="opponent_player4" 
														options={this.state.optionSelect} 
														handleSelect={this.handleOpponentSelect} 
														selected={this.state.OpponentSelect.opponent_player4}
													/>
												</div>
											</div>
											<div className="stats-player-select col-md-12">
												<div className="col-md-6">
													<input 
														type="text" 
														className="form-control input-lg" 
														placeholder="Player in game name" 
														aria-required="true" 
														autoComplete="off" 
														name="opponent_player5" 
														onChange={this.handleChangeOpponentInput}
														defaultValue={this.state.OpponentInputs.opponent_player5}
													/>
												</div>
												<div className="col-md-6">
													<Select 
														optionname="opponent_player5" 
														options={this.state.optionSelect}
														handleSelect={this.handleOpponentSelect} 
														selected={this.state.OpponentSelect.opponent_player5}
													/>
												</div>
											</div>
										</PortletBody>
									</Portlet>
								</TabPanel>
							</Tabs>
						</div>
						<div className="modal-footer">
							{ this.state.ShowNextButton ? 
								<button 
									type         = "button"
									className    = "btn btn-default"
									onClick      = {(e) => this.handleBattleUrl(e, MatchId, ID)}
								>Next
								</button>
							:
								<input 
									type      = "submit"
									className = "btn btn-primary m--margin-right-5"
									disabled  = {this.state.isDisabledButton}
									value     = "Submit" 
								/>
							}
							<button 
								type         = "button"
								className    = "btn btn-default"
								data-dismiss = "modal"
								onClick      = {cancelFn}
							>Dismiss
							</button>
						</div>
					</form>
				</div>
			</Modal>
		)
	}
}

FinishBattleModal.propTypes = {
	battleStats: PropTypes.func.isRequired,
	sendMatchStats: PropTypes.func.isRequired
}

