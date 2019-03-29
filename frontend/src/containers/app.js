import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

import CreateUser from './create'
import LoginUser from './login'
import Profile from './profile'
import Dashboard from './dashboard'
import Stats from './stats'
import Schedule from './schedule'
import ResetPassword from './reset_password'
import Admin from './admin'
import Rules from './rules'

let privateRoute = ({ user, location, needAdmin = false, component: Component, ...rest }) => {
  const satisfied = user && (!needAdmin || user.is_admin)

  return (
    <Route {...rest} render={props => (
      satisfied ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: location } }}/>
      )
    )}/>
  )
}

privateRoute.propTypes = {
  user: PropTypes.object,
  needAdmin: PropTypes.bool,
  location: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  location: state.routing.location,
})

const PrivateRoute = connect(mapStateToProps)(privateRoute);

const App = () => (
  <Switch>
    <Route path="/login" component={LoginUser} />
    <Route path="/create" component={CreateUser} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/rules" component={Rules} />
    <PrivateRoute path="/register" component={Profile} />
    <PrivateRoute path="/dashboard" component={Dashboard} />
    <PrivateRoute path="/stats" component={Stats} />
    <PrivateRoute path="/schedule" component={Schedule} />
    <PrivateRoute path="/admin" component={Admin} needAdmin={true} />
    <Redirect to="/dashboard"/>
  </Switch>
)

export default App;
