import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { StripeProvider, Elements } from 'react-stripe-elements';

import { fetchPayment, submitPayment, paymentReceived, paymentError } from '../actions'
import SavedCard from '../components/saved_card'
import CheckoutForm from '../components/checkout_form'
import RegisterFormActions from '../components/register_form_actions'


class Payment extends React.Component {

  render() {
    const { card, paymentPending, sendPayment, stripePublicKey, forgetCard, paymentError, prevTab, nextTab } = this.props

    let { error } = this.props;
    if (error === 'no payment source for specified customer') error = null; // this is what we're here to fix!

    let child
    if (card) {
      child = <SavedCard card={card} forgetCard={forgetCard} />
    } else if (paymentPending || !stripePublicKey) {
      return <div>Loading...</div>
    } else {
      child = (
        <StripeProvider apiKey={stripePublicKey}>
          <Elements>
            <CheckoutForm sendPayment={sendPayment} error={error} paymentError={paymentError} />
          </Elements>
        </StripeProvider>
      )
    }

    return (
      <div id="payment__vp">
        <div className="row">
          {child}
        </div>
        <div className="row">
          <RegisterFormActions prevFn={prevTab} nextFn={card ? nextTab : null} />
        </div>
      </div>
    )
  }
}

Payment.propTypes = {
  card: PropTypes.object,
  error: PropTypes.string,
  paymentPending: PropTypes.bool.isRequired,
  stripePublicKey: PropTypes.string,
  sendPayment: PropTypes.func.isRequired,
  paymentError: PropTypes.func.isRequired,
  forgetCard: PropTypes.func.isRequired,
  prevTab: PropTypes.func,
  nextTab: PropTypes.func,
  couponCode: PropTypes.string,
}

const mapStateToProps = state => ({
  card: state.payment.card,
  error: state.payment.error,
  paymentPending: state.payment.isPending,
  stripePublicKey: state.payment.stripePublicKey,
})

const mapDispatchToProps = (dispatch) => ({
  fetchPayment: () => dispatch(fetchPayment()),
  sendPayment: (stripeToken, couponCode) => dispatch(submitPayment({ stripeToken, couponCode })),
  paymentError: (error) => dispatch(paymentError(error)),
  forgetCard: () => dispatch(paymentReceived({})),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment)
