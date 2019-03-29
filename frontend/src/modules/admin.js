import { ADMIN_PENDING, ADMIN_USERS_RECEIVED } from '../actions';

const initialState = {
    users: [],
    isPending: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADMIN_PENDING:
            return {
                ...state,
                isPending: true
            }
        
        case ADMIN_USERS_RECEIVED:
            return {
                ...state,
                isPending: false,
                users: action.payload
            }
        
        default:
            return state;
    }
}