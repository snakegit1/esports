import {
  PAYMENT_PENDING, PAYMENT_ERROR, PAYMENT_RECEIVED, PAYMENT_CONFIG_RECEIVED
} from '../actions'

const initialState = {
  error: null,
  isPending: false,
  card: null,
  stripePublicKey: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_PENDING:
      return {
        ...state,
        isPending: true
      }

    case PAYMENT_CONFIG_RECEIVED:
      return {
        ...state,
        stripePublicKey: action.payload.stripePublicKey,
      }

    case PAYMENT_ERROR:
      return {
        ...state,
        error: action.payload,
        isPending: false,
      }

    case PAYMENT_RECEIVED:
      return {
        ...state,
        isPending: false,
        card: action.payload,
      }

    default:
      return state
  }
}
