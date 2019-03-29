import {
  BATTLE_PENDING, BATTLE_RECEIVED, BATTLE_ERROR
} from '../actions'

const initialState = {
  error: null,
  isPending: false,
  champions: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case BATTLE_PENDING:
      return {
        ...state,
        isPending: true
      }

    case BATTLE_ERROR:
      return {
        ...state,
        iPending: false,
        error: action.payload,
        champions: {},
      }

    case BATTLE_RECEIVED:
      return {
        ...state,
        isPending:false, 
        champions: action.payload.champions,
      }

    default:
      return state
  }
}
