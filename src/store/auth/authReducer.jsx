import { 
    REDUX_GET_USER_ACCESS_INFORMATION,
    REDUX_LOGOUT_USER
} from "./authAction"

const InitialStates  = {
    StateToken:                  null,
    StateUserInformation:        []
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case REDUX_LOGOUT_USER:
            return{
                ...state,
                StateToken              : action.StateToken
            }
        case REDUX_GET_USER_ACCESS_INFORMATION:
            return{
                ...state,
                StateToken              : action.StateToken,
                StateUserInformation    : action.userInformation
            }
        default :
            return{
                ...state
            }
    }
    return state
}