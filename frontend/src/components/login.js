import React from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import { defaultUsername, defaultPassword, googleLoginUrl, facebookLoginUrl } from '../env'
import ErrorModal from './error_modal'

import './login.css'
import logo from '../assets/edl_logo_black.png'
import facebook from '../assets/facebook_circle.svg'
import google from '../assets/google_circle.svg'

import Content from './uielements/content';
import Portlet from './uielements/portlet/portlet';
import PortletBody from './uielements/portlet/portletBody';
import PortletFooter from './uielements/portlet/portletFooter';


const LoginForm = ({authenticate, isPending, error, dismissError}) => {
  let submitForm = e => {
    e.preventDefault();
    authenticate(this.username.value, this.password.value);
  }
  return (
    <div id="login__vp">
      <ErrorModal errors={error ? error.split('   ') : []} dismiss={dismissError} />
        <Content>
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-8">
                <Portlet>
                  <PortletBody>
                    <div className="logo text-center"><img src={logo} className="img-fluid" alt="EAL Logo" width="375px"/></div>
                    <p className="lead text-center ">
                      Welcome to Esports Development League. Create a new account with social logins or by pressing create account below.
                    </p>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group social">
                          <a href={facebookLoginUrl()} className="btn btn-md btn-facebook">
                            <i className="fa fa-facebook" aria-hidden="true"></i> Facebook
                          </a>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group social">
                          <a href={googleLoginUrl()} className="btn btn-md btn-google-plus">
                            <i className="fa fa-google-plus" aria-hidden="true"></i> Google
                          </a>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group social">
                          <Link to="/create" className="btn btn-primary btn-md">
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </div>
                    <form id="loginForm" onSubmit={submitForm} >
                      <div className="form-group ">
                        <div className="input-group">
                          <input type="text" className="form-control input-lg" placeholder="email" aria-required="true" aria-describedby="email-error" aria-invalid="true" autoComplete="off" defaultValue={defaultUsername} ref={ input => { this.username = input }}/>
                        </div>
                      </div>
                      <div className="form-group ">
                        <div className="input-group">
                          <input type="password" className="form-control input-lg" placeholder="password" aria-required="true" aria-describedby="email-error" aria-invalid="true" autoComplete="off" defaultValue={defaultPassword} ref={ input => { this.password = input }}/>
                        </div>
                      </div>
                      <div className="text-center">
                        <Link to="/reset">Forgot Password?</Link>
                      </div>
                    </form>
                  </PortletBody>
                  <div className="portlet-login-footer">
                    <div className="row">
                      <div className="col-sm-8 col-sm-offset-2">
                        <button type="submit" form="loginForm" className="btn btn-lg btn-primary m-btn--pill full-width">
                          SIGN IN
                        </button>
                      </div>
                    </div>
                  </div>
                </Portlet>
              </div>
            </div>
          </div>
        </Content>
    </div>
  )
}

LoginForm.propTypes = {
  authenticate: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissError: PropTypes.func.isRequired,
}

export default LoginForm
