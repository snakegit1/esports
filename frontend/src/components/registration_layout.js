import React from 'react'
import { PropTypes } from 'prop-types'

import BreadCrumbs from '../components/breadcrumbs'
import Header from './header'
import Footer from './footer'

import WizardSteps from '../components/wizard_steps'
import Content from '../components/uielements/content';
import Portlet from '../components/uielements/portlet/portlet';
import PortletHead from '../components/uielements/portlet/portletHead';
import PortletHeadCaption from '../components/uielements/portlet/portletHeadCaption';
import PortletBody from '../components/uielements/portlet/portletBody';



import './registration_layout.css'

const RegistrationLayout = ({ child, step = 1, maxStep = 1, user, logout }) => (
  <section id="reg__vp">
    <div id="wrap">
      <div id="main">
        <Header crumbs={['Registration']} name={user.email} logout={logout} isAdmin={user.is_admin}></Header>
        <Content>
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-xs-12 col-sm-9">
                <WizardSteps step={step} maxStep={maxStep} />
                <Portlet id="registration-portlet">
                  <PortletHead>
                    <PortletHeadCaption>Registration</PortletHeadCaption>
                  </PortletHead>
                  <PortletBody>
                    {child}
                  </PortletBody>
                </Portlet>
              </div>
            </div>
          </div>
        </Content>
      </div>
    </div>
  </section>
)

RegistrationLayout.propTypes = {
  child: PropTypes.node.isRequired,
  step: PropTypes.number,
  maxStep: PropTypes.number,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
}

export default RegistrationLayout
