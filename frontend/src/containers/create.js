import React from 'react'
import { PropTypes } from 'prop-types'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { sendCreateAccount, authDismissError } from '../actions'
import CreateAccount from '../components/create_account'

const CreateController = ({ user, isPending, error, dismissError, createAccount }) => {
  if (user) return <Redirect to='/register' />
  return <CreateAccount create={createAccount} isPending={isPending} error={error} dismissError={dismissError} />
}

CreateController.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  createAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  isPending: state.auth.isPending,
  error: state.auth.error,
})

const mapDispatchToProps = dispatch => ({
  dismissError: () => dispatch(authDismissError()),
  createAccount: (email, password) => dispatch(sendCreateAccount({ email, password }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateController)
