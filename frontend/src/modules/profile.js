import {
  PROFILE_PENDING, PROFILE_ERROR, PROFILE_RECEIVED, PROFILES_MAP_RECEIVED, PROFILE_STEP_REQUESTED
} from '../actions'

const initialState = {
  error: null,
  isPending: false,
  profile: null,
  requestedStep: 5,
  byId: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_PENDING:
      return {
        ...state,
        isPending: true
      }

    case PROFILE_STEP_REQUESTED:
      return {
        ...state,
        requestedStep: action.payload
      }

    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        isPending: false,
      }

    case PROFILES_MAP_RECEIVED:
      return {
        ...state,
        isPending: false,
        byId: action.payload,
      }

    case PROFILE_RECEIVED:
      return {
        ...state,
        isPending: false,
        profile: action.payload
      }

    default:
      return state
  }
}
