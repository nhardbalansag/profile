import axios from 'axios';

const env = import.meta.env;
const PublicAPI = env.VITE_APP_BACKEND_API_URL + "public/"

export const getAllActivePageConfig = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}get-page-config`
    });
}

export const GetAllLanguages = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}languages`
    });
}

export const CreateFrontendErrorLogs = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${env.VITE_APP_BACKEND_API_URL}add-log`,
        data: reqBody
    });
}