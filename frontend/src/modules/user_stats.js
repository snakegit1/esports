import {
  USER_STATS_PENDING, USER_STATS_RECEIVED, USER_STATS_ERROR
} from '../actions'

const initialState = {
  error: null,
  isPending: false,
  user_stats: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_STATS_PENDING:
      return {
        ...state,
        isPending: true
      }

    case USER_STATS_ERROR:
      return {
        ...state,
        iPending: false,
        error: action.payload,
        user_stats: {},
      }

    case USER_STATS_RECEIVED:
      return {
        ...state,
        isPending:false, 
        user_stats: action.payload,
      }

    default:
      return state
  }
}
