import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "public/"
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const GetHomeContents = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}contents`
    });
}

export const GetClientSecret = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${BaseAPIUrl}create-payment-intent`,
        data: reqBody
    });
}