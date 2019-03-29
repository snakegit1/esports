import React from 'react'
import { PropTypes } from 'prop-types'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { sendCreateAccount, authDismissError } from '../actions'
import Rules from '../components/rules'

const RulesController = () => {
	return <Rules />
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Rules)