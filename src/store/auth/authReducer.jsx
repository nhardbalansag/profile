import { 
    REDUX_GET_USER_ACCESS_INFORMATION,
    REDUX_LOGOUT_USER,
    STORAGE_PAGE_LANGUAGES,
    STORAGE_LANGUAGES,
    STORAGE_sELECTED_LANGUAGES,
    Get_Two_Factor_Authentication
} from "./authAction"

const InitialStates  = {
    // StateToken: null,
    StateToken: null,
    payload: null,
    StateUserInformation:   [],
    PageLanguages:  [],
    Languages:  [],
    SelectedLanguage:  null,
    TwoFactorToken:  null,
    TwoFactor:  [
        {
            two_factor_enabled_at: null,
            two_factor_confirmed_at: null,
        }
    ]
    // SelectedLanguage:  1
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case Get_Two_Factor_Authentication:
            return{
                ...state,
                TwoFactor              : action.TwoFactor,
                TwoFactorToken         : action.TwoFactorToken,
            }
        case REDUX_LOGOUT_USER:
            return{
                ...state,
                StateToken              : action.StateToken,
                StateUserInformation              : action.StateUserInformation,
                SelectedLanguage              : action.SelectedLanguage,
            }
        case REDUX_GET_USER_ACCESS_INFORMATION:
            return{
                ...state,
                StateToken              : action.StateToken,
                StateUserInformation    : action.StateUserInformation,
                payload                 : action.payload
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