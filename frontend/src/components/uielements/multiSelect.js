import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class MultiSelect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name           : this.props.initSelect.name ? this.props.initSelect.name : 'form-field-name',
			selectedOption : this.props.initSelect.selectedOption,
			removeSelected : this.props.initSelect.removeSelected,
			disabled       : this.props.initSelect.disabled,
			stayOpen       : this.props.initSelect.stayOpen,
			value          : this.props.initSelect.value,
			rtl            : this.props.initSelect.rtl,
			placeholder    : this.props.initSelect.placeholder,
			options        : this.props.optionSelect,
			multi          : this.props.initSelect.multi,
			matchPos       : this.props.initSelect.matchPos ? this.props.initSelect.matchPos : 'start',
			matchValue     : this.props.initSelect.matchValue ? this.props.initSelect.matchValue : false,
			matchLabel     : this.props.initSelect.matchLabel ? this.props.initSelect.matchLabel : false,
		};
	}

	handleSelectChange = (value) => {
		this.setState({ value });
		this.props.handlerFromModal({val: value, name: this.state.name});
	}

	render() {
		return (
			<div className="section">
				<Select
					name           = {this.state.name}
					closeOnSelect  = {!this.state.stayOpen}
					disabled       = {this.state.disabled}
					multi          = {this.state.multi}
					onChange       = {this.handleSelectChange}
					options        = {this.state.options}
					placeholder    = {this.state.placeholder}
					removeSelected = {this.state.removeSelected}
					simpleValue
					value          = {this.state.value}
					rtl            = {this.state.rtl}
					matchPos       = {this.state.matchPos}
					matchValue     = {this.state.matchValue}
					matchLabel     = {this.state.matchLabel}
				/>
			</div>
		);
	}
}
