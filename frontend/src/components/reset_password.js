import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'

import ErrorModal from './error_modal'

import './reset_password.css'
import logo from '../assets/esports-logo-primary.png'
import Content from '../components/uielements/content';
import Portlet from '../components/uielements/portlet/portlet';
import PortletHead from '../components/uielements/portlet/portletHead';
import PortletHeadCaption from '../components/uielements/portlet/portletHeadCaption';
import PortletHeadTools from '../components/uielements/portlet/portletHeadTools';

import PortletBody from '../components/uielements/portlet/portletBody';


class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = { sent: false }
    this.submitForm = this.submitForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending) this.setState({ sent: true })
  }

  submitForm(e) {
    e.preventDefault()
    this.props.sendReset(this.email.value)
  }

  render() {
    const { isPending, error, dismissError } = this.props
    const { sent } = this.state

    return (
      <div id="reset__vp">
        <ErrorModal errors={error ? error.split('   ') : []} dismiss={dismissError} />
        <Content>
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-sm-6 col-xs-12">
              <Portlet>
                <PortletHead>
                  <PortletHeadCaption>Password Reset</PortletHeadCaption>
                  <PortletHeadTools>
                    <ul className="m-portlet__nav">
                      <li className="m-portlet__nav-item">
                        <Link to="/" className="btn btn-secondary m-btn m-btn--custom m-btn--pill">
                          <span>
                            <span>Back</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </PortletHeadTools>
                </PortletHead>
                <PortletBody>
                  <div className="logo text-center">
                    <Link to="/">
                      <img src={logo} alt="EAL Logo" width="250px"/>
                    </Link>
                  </div>
                  { (!sent || isPending) ? null :
                    <div className="info">
                      Check your email for a link to reset your password. After you've created a new password, login <Link to="/login">here</Link>.
                    </div>
                  }
                  <form onSubmit={this.submitForm} >
                    <div className="form-group ">
                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-envelope fa-lg fa-fw"></i>
                        </span>
                        <input type="text" className="form-control input-lg" placeholder="email" aria-required="true" autoComplete="off" ref={ input => { this.email = input }}/>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary full-width">
                      Reset My Password
                    </button>
                  </form>
                </PortletBody>
              </Portlet>
              </div>
            </div>
          </div>
        </Content>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  isPending: PropTypes.bool.isRequired,
  error: PropTypes.string,
  sendReset: PropTypes.func.isRequired,
  dismissError: PropTypes.func.isRequired,
}

export default ResetPassword
