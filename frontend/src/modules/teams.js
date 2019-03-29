import {
  DRAFT_DATE_PENDING, DRAFT_DATE_RECEIVED, TEAMS_PENDING, TEAMS_ERROR, TEAMS_RECEIVED
} from '../actions'

const initialState = {
  draftDate: null,
  datePending: false,
  teams: [],
  myTeam: null,
  error: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DRAFT_DATE_PENDING:
      return {
        ...state,
        datePending: true
      }

    case DRAFT_DATE_RECEIVED:
      return {
        ...state,
        datePending: false,
        draftDate: action.payload,
      }

    case TEAMS_PENDING:
      return {
        ...state,
        teamsPending: true
      }

    case TEAMS_ERROR:
      return {
        ...state,
        teamsPending: false,
        error: action.payload,
      }

    case TEAMS_RECEIVED:
      let { myTeam, teams } = state;
      if (action.payload.mine) {
        myTeam = (action.payload.teams || [null])[0];
      } else {
        teams = action.payload.teams;
      }

      return {
        ...state,
        teamsPending: false,
        teams,
        myTeam,
      }

    default:
      return state
  }
}
