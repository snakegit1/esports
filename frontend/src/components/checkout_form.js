import React from 'react'
import { PropTypes } from 'prop-types'
import { injectStripe, CardElement } from 'react-stripe-elements';

import ErrorModal from './error_modal'

import './checkout_form.css'

const CardSection = () => (
  <label>
    <CardElement style={{base: {fontSize: '18px'}}} />
  </label>
)

let CheckoutForm = ({ card, stripe, sendPayment, error, paymentError }) => {

  let handleSubmit = (ev) => {
	ev.preventDefault();

    stripe.createToken({type: 'card', name: ''}).then(({token, error}) => {
      if (error) paymentError(error.message)
      else if (token) sendPayment(token, this.coupon.value)
    });
  }

  return (
    <div id="checkform__vp" className="full-width">
      <ErrorModal errors={error ? [error] : []} dismiss={() => paymentError()} />
      <div className="benefits">
        <span>Your $25 league fee entitles you to:</span>
        <ul>
          <li>Placement on a team</li>
          <li>6 week season</li>
          <li>Access to community and team chat</li>
          <li>Stats for tracking progress</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <CardSection />
        <input type="text" className="form-control input-lg" placeholder="Coupon code" aria-required="true" autoComplete="off" ref={ input => { this.coupon = input }}/>
        <button>Purchase one season for $25</button>
        <div className="clearfix"></div>
      </form>
    </div>
  )
}

CheckoutForm.propTypes = {
  stripe: PropTypes.object.isRequired,
  error: PropTypes.string,
  sendPayment: PropTypes.func.isRequired,
  paymentError: PropTypes.func.isRequired,
}

export default CheckoutForm = injectStripe(CheckoutForm);
