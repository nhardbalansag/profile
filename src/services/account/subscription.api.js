import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "account/subscriptions/" 
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const getPaginatedOrders = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}all-subscriptions`
    });
}

export const AllUserSubscriptionCategories = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}getAllSubscription`
    });
} 

export const GetClientSecret = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}create-payment-intent`,
        data: reqBody
    });
}

export const createEbanxPayment = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${BaseAPIUrl}account/ebanx/create-payment-intent`,
        data: reqBody
    });
}

export const CheckSubscriptionPaymentIntentStatus = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}validate-payment-intent-status`,
        data: reqBody
    });
}

export const GetUserAccountSubscriptionDetails = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}account-subscription`
    });
}

export const UnsubscribeToStripe = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}unsubscribe-stripe`,
    });
}