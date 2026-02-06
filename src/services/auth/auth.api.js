import axios from 'axios';
const env = import.meta.env;
const PublicAPI = env.VITE_APP_BACKEND_API_URL

export const LoginUser = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}auth/login`, 
        data: reqBody
    });
}

export const GetLoginDataToUsersAccount = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${PublicAPI}cms/support/get-login-data-to-user`, 
    });
}

export const ForgotPassword = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}auth/forgot-password`, 
        data: reqBody
    });
}

export const RegisterUser = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}auth/register`, 
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

export const getSponsorDetails = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}public/sponsor`, 
        data: reqBody
    });
}

export const GetClientSecret = async (reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `${PublicAPI}create-payment-intent`,
        data: reqBody
    });
}