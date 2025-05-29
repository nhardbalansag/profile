import axios from 'axios';
const env = import.meta.env;
const PublicAPI = env.VITE_APP_BACKEND_API_URL

export const LoginUser = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}login`, 
        data: reqBody
    });
}

export const RegisterUser = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}register`, 
        data: reqBody
    });
}

export const userSubscriptionCategories = async (id) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}public/subscriptions`
    });
} 
