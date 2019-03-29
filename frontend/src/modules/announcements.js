import {
  ANNOUNCEMENTS_PENDING, ANNOUNCEMENTS_RECEIVED
} from '../actions'

const initialState = {
  announcements: null,
  isPending: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ANNOUNCEMENTS_PENDING:
      return {
        ...state,
        isPending: true
      }

    case ANNOUNCEMENTS_RECEIVED:
      return {
        ...state,
        isPending: false,
        announcements: action.payload,
      }

    default:
      return state
  }
}
