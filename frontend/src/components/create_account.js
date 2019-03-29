import React from 'react'
import { PropTypes } from 'prop-types'

import BreadCrumbs from './breadcrumbs'
import Header from './header'
import WizardSteps from './wizard_steps'
import RegisterFormActions from './register_form_actions'
import ErrorModal from './error_modal'

import Content from './uielements/content';
import Portlet from './uielements/portlet/portlet'
import PortletHead from './uielements/portlet/portletHead'
import PortletHeadCaption from './uielements/portlet/portletHeadCaption'
import PortletHeadTools from './uielements/portlet/portletHeadTools'
import PortletBody from './uielements/portlet/portletBody'

import './create_account.css'

const CreateAccount = ({create, isPending, error, dismissError}) => {
  let submitForm = e => {
    e.preventDefault()
    create(this.email.value, this.password.value)
  }

  return (
    <div id="ca__vp">
      <ErrorModal errors={error ? error.split('   ') : []} dismiss={dismissError} />
      <Header crumbs={['Create Account']} name={null} logout={null}></Header>
      <Content>
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-sm-offset-2">
              <WizardSteps step={1} />
              <Portlet id="registration-portlet">
                <PortletHead>
                  <PortletHeadCaption>Registration</PortletHeadCaption>
                </PortletHead>
                <PortletBody>
                <form onSubmit={submitForm} className="m-form m-form--fit m-form--label-align-right">
                  <div className="form-group m-form__group">
                    <label>Email address</label>
                    <input type="text" className="form-control m-input m-input--square" placeholder="email@address.com" name="email" id="email" aria-required="true" aria-describedby="email-error" aria-invalid="true" autoComplete="off" ref={ input => { this.email = input }}/>
                    <span className="m-form__help">Your email address will be your username</span>
                  </div>
                  <div className="form-group m-form__group">
                    <label>Password</label>
                    <input type="password" className="form-control m-input m-input--square" placeholder="password" name="password" id="password" aria-required="true" aria-describedby="password-error" autoComplete="off" ref={ input => { this.password = input }}/>
                  </div>
                </form>
                </PortletBody>
                <div className="row">
                  <RegisterFormActions nextFn={submitForm} />
                </div>
              </Portlet>
            </div>
          </div>
        </div>
      </Content>
    </div>
  )
}

CreateAccount.propTypes = {
  isPending: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissError: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
}

export default CreateAccount
