import React from 'react'
import PropTypes from 'prop-types'

import './wizard_steps.css'

function classFor(curStep, maxStep, elementStep) {
  if (curStep === elementStep) return 'active'
  if (curStep > elementStep || (maxStep && maxStep >= elementStep)) return 'complete'
  return ''
}

export const WizardBullets = ({step, maxStep}) => (
  <div id="ws__vp">
    <ul className="bootstrapWizard form-wizard">
      <li className={ classFor(step, maxStep, 1) } data-target="#step1">
        <span className="step">1</span> <span className="title">Create account</span>
      </li>
      <li className={ classFor(step, maxStep, 2) } data-target="#step2">
        <span className="step">2</span> <span className="title">Team placement</span>
      </li>
      {/* <li className={ classFor(step, maxStep, 3) } data-target="#step3">
        <span className="step">3</span> <span className="title">Payment</span>
      </li> */}
      <li className={ classFor(step, maxStep, 3) } data-target="#step4">
        <span className="step">3</span> <span className="title">Profile details</span>
      </li>
      <li className={ classFor(step, maxStep, 4) } data-target="#step5">
        <span className="step">4</span> <span className="title">Earn money</span>
      </li>
    </ul>
    <div className="clearfix"></div>
  </div>
)

WizardBullets.propTypes = {
  step: PropTypes.number.isRequired,
  maxStep: PropTypes.number
}

export default WizardBullets;
