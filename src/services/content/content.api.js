import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "public/"
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const ChatLogin = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${BaseAPIUrl}chatify-verification`,
    });
}

export const GetHomeContents = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}contents`
    });
}

export const AddContentEngagement = async (token, request) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${BaseAPIUrl}account/engagement`,
        data: request
    });
}

export const ShowContent = async (id) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}show-content/${id}`
    });
}

export const GetTravelProductContent = async (id, token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/show-product-content/${id}`
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
        url: `${BaseAPIUrl}create-payment-intent`,
        data: reqBody
    });
}

export const createEBanxTripPaymentIntent = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${BaseAPIUrl}account/ebanx/trip/create-payment-intent`,
        data: reqBody
    });
}

export const GetTravelBucketListContent = async (token, url, request) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'post', 
        url: url ? url : `${BaseAPIUrl}account/bucket-list`,
        data: request
    });
}

export const GetAllBucketListCategory = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/bucket-list-categories`
    });
}

export const GetEventListContent = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}event-list`
    });
}

export const CheckBookingPaymentIntentStatus = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${BaseAPIUrl}account/orders/validate-payment-intent-status`,
        data: reqBody
    });
}

export const GetEarnPageContent = async (token) => {

    return await axios({
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `${token}`,
            ...token
        },
        method: "GET",
        url: `${BaseAPIUrl}account/earn/get-earn-content`
    });
}

export const GetGrowPageContent = async (token) => {

    return await axios({
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `${token}`,
            ...token
        },
        method: "GET",
        url: `${BaseAPIUrl}account/grow/get-grow-content`
    });
}


export const GetGrowPagePaidContent = async (token) => {

    return await axios({
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `${token}`,
            ...token
        },
        method: "GET",
        url: `${BaseAPIUrl}account/grow/get-grow-paid-content`
    });
}