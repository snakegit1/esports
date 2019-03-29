import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { sendAuthRequest, sendTokenCheck, authDismissError } from '../actions'
import LoginForm from '../components/login'

function parseUrlToken(searchStr) {
  const arr = (searchStr || '').split('token=')
  if (arr.length < 2) {
    return undefined;
  }
  return arr[1].split('&')[0]
}

const LoginController = ({location, user, error, isPending, authenticate, validateToken, dismissError }) => {
  let token = parseUrlToken(location.search)
  if (token) {
    validateToken(token);
    return <Redirect to='/' />
  }
  if (!user) {
    return <LoginForm authenticate={authenticate} isPending={isPending} error={error} dismissError={dismissError} />
  } else {
    return <Redirect to='/' />
  }
}

const mapStateToProps = state => ({
  isPending: state.auth.isPending,
  user: state.auth.user,
  error: state.auth.error,
  location: state.routing.location,
})

const mapDispatchToProps = dispatch => {
  return {
    validateToken: (token) => { dispatch(sendTokenCheck(token)); },
    authenticate: (email, password) => { dispatch(sendAuthRequest({ email, password })); },
    dismissError: () => { dispatch(authDismissError()); },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginController)
