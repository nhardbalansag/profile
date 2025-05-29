export const REDUX_GET_USER_ACCESS_INFORMATION = 'REDUX_GET_USER_ACCESS_INFORMATION';
export const REDUX_PAYLOAD_INFORMATION = 'REDUX_PAYLOAD_INFORMATION';
export const REDUX_LOGOUT_USER = 'REDUX_LOGOUT_USER';

export const STORAGE_TOKEN = 'STORAGE_TOKEN';
export const STORAGE_USER_INFORMATION = 'STORAGE_USER_INFORMATION';
export const STORAGE_PAGE_LANGUAGES = 'STORAGE_PAGE_LANGUAGES';
export const STORAGE_LANGUAGES = 'STORAGE_LANGUAGES';
export const STORAGE_sELECTED_LANGUAGES = 'STORAGE_sELECTED_LANGUAGES';

export const LoginUser = (token, userInformation, payload) =>{

    return async (dispatch, getState) =>{
        dispatch({
            type                    :  REDUX_GET_USER_ACCESS_INFORMATION,
            StateToken              :  token,
            StateUserInformation    :  userInformation,
            payload                 :  payload,
        }) 
    }
}

export const LogoutUser = () =>{
    return async (dispatch, getState) =>{
        dispatch({
            type        : REDUX_LOGOUT_USER,
            StateToken  : null,
            StateUserInformation : []
        }) 
    }
}

export const GetPageLanguageTranslation = (content) =>{
    return async (dispatch, getState) =>{
        dispatch({
            type        : STORAGE_PAGE_LANGUAGES,
            PageLanguages  : content
        }) 
    }
}

export const GetAllLanguages = (languages) =>{
    return async (dispatch, getState) =>{
        dispatch({
            type        : STORAGE_LANGUAGES,
            Languages  : languages
        }) 
    }
}

export const AddSelectedLanguage = (language) =>{
    return async (dispatch, getState) =>{
        dispatch({
            type        : STORAGE_sELECTED_LANGUAGES,
            SelectedLanguage  : language
        }) 
    }
}

