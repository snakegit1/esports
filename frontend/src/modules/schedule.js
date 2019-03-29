import {
  SCHEDULE_PENDING, SCHEDULE_RECEIVED, UNSCHEDULE_RECEIVED
} from '../actions'

const initialState = {
  error: null,
  isPending: false,
  myschedule: null,
  unscheduled: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULE_PENDING:
      return {
        ...state,
        isPending: true
      }

    case SCHEDULE_RECEIVED:
      return {
        ...state,
        isPending:false, 
        myschedule: action.payload,
      }
    case UNSCHEDULE_RECEIVED:
      return {
        ...state,
        isPending:false, 
        unscheduled: action.payload,
      }

    default:
      return state
  }
}
