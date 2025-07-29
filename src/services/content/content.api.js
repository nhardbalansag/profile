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
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/show-product-content/${id}`
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

export const GetTravelBucketListContent = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/bucket-list`
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
            'Authorization': `Bearer ${token}`
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
            "Authorization": `Bearer ${token}`,
        },
        method: "GET",
        url: `${BaseAPIUrl}account/earn/get-earn-content`
    });
}

export const GetGrowPageContent = async (token) => {

    return await axios({
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        method: "GET",
        url: `${BaseAPIUrl}account/grow/get-grow-content`
    });
}