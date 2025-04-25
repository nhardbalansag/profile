import { 
    REDUX_GET_USER_ACCESS_INFORMATION,
    REDUX_LOGOUT_USER,
    STORAGE_PAGE_LANGUAGES,
    STORAGE_LANGUAGES,
    STORAGE_sELECTED_LANGUAGES
} from "./authAction"

const InitialStates  = {
    // StateToken: null,
    StateToken: "null",
    StateUserInformation:   [],
    PageLanguages:  [],
    Languages:  [],
    SelectedLanguage:  null
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
                StateUserInformation    : action.StateUserInformation
            }
        case STORAGE_PAGE_LANGUAGES:
            return{
                ...state,
                PageLanguages   : action.PageLanguages
            }
        case STORAGE_LANGUAGES:
            return{
                ...state,
                Languages   : action.Languages
            }
        case STORAGE_sELECTED_LANGUAGES:
            return{
                ...state,
                SelectedLanguage   : action.SelectedLanguage
            }
        default :
            return{
                ...state
            }
    }
    return state
}