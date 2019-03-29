import {
  AUTH_SENT, AUTH_RECEIVED, AUTH_DISMISS_ERROR
} from '../actions'

let rawUser = window.localStorage['user']
let user = rawUser ? JSON.parse(rawUser) : null

const initialState = {
  error: null,
  isPending: false,
  user: user,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SENT:
      return {
        ...state,
        isPending: true
      }

    case AUTH_RECEIVED:
      return {
        ...state,
        isPending: false,
        error: action.payload.error,
        user: action.payload.user
      }

    case AUTH_DISMISS_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}
