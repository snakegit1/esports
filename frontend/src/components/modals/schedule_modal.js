import React from 'react'
import { PropTypes } from 'prop-types'

import Modal from '../modal'

import Portlet from '../uielements/portlet/portlet'
import PortletHead from '../uielements/portlet/portletHead'
import PortletHeadCaption from '../uielements/portlet/portletHeadCaption'
import PortletHeadTools from '../uielements/portlet/portletHeadTools'
import PortletBody from '../uielements/portlet/portletBody'


import MultiSelect from '../uielements/multiSelect'

import './modal.css'

export default class ScheduleModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initSelect: {
				selectedOption : '',
				removeSelected : true,
				disabled       : false,
				stayOpen       : true,
				multi          : true,
				value          : [],
				rtl            : false,
				placeholder    : 'Select dates'
			},
			optionSelect: [
				{ label: 'Monday 6pm PT', value: 'Monday 6pm PT' },
				{ label: 'Tuesday 6pm PT', value: 'Tuesday 6pm PT' },
				{ label: 'Wednesday 6pm PT', value: 'Wednesday 6pm PT' },
				{ label: 'Thursday 6pm PT', value: 'Thursday 6pm PT' },
				{ label: 'Friday 6pm PT', value: 'Friday 6pm PT' },
				{ label: 'Saturday 11am PT', value: 'Saturday 11am PT' },
				{ label: 'Saturday 1pm PT', value: 'Saturday 1pm PT' },
			],
			isDisabledButton: true
		}
	}

	handleSubmit=(e, MatchId, ID)=>{
		e.preventDefault();
		this.props.setSchedules(ID, MatchId, this.state.arrSelect, this.props.schedule.dates);
		this.props.cancelFn();
	}

	handleValueSelect=(e)=>{
		this.state.arrSelect = e.val;
		if( this.state.arrSelect.split (',').length < 3 || this.state.arrSelect.split (',').length === false ){
			this.setState({
				isDisabledButton: true
			}) 
		}else{
			this.setState({
				isDisabledButton: false
			})
		}
	}

	render() {
		const { cancelFn, setSchedules, MatchId, ID } = this.props;

		return (
			<Modal show={true}>
				<div id="schedulemod__vp" className="modal-content panel b-a">
					<form onSubmit={(e) => this.handleSubmit(e, MatchId, ID)}>
						<div className="modal-header">
							<h4 className="modal-title">Schedule Match</h4>
						</div>
						<div className="modal-body">
							<Portlet>
								<PortletBody>
									<p>Select at least 3</p>
									<MultiSelect 
										initSelect       = {this.state.initSelect}
										optionSelect     = {this.state.optionSelect}
										handlerFromModal = {this.handleValueSelect}
									/>
								</PortletBody>
							</Portlet>
						</div>
						<div className="modal-footer">
							<input 
								type      = "submit"
								className = "btn btn-primary m--margin-right-5"
								value     = "Submit" 
								disabled  = {this.state.isDisabledButton}
							/>
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

ScheduleModal.propTypes = {
	setSchedules: PropTypes.func.isRequired
	/*  title: PropTypes.string,
		errors: PropTypes.array.isRequired,
		dismiss: PropTypes.func.isRequired,
		*/
}

