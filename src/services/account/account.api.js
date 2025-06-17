import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "account/wallet/"
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const getTBucksAndTPoints = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${PublicAPI}home`
    });
}

export const requestToken = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/jwt/token`
    });
}

export const xeniRegisterApi = async (body) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST', 
        url: `https://travelapi.ai:443/api/sso/agencySSOSignup`,
        data: body
    });
}

export const UpdateAccountXeniPlatformAccess = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/features/xeni`
    });
}

export const getAccountTransaction = async (token, url) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: url ? url : `${PublicAPI}paginated-transaction`
    });
}

export const getAccountToTransfer = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${PublicAPI}get-account-to-transfer`,
        data: reqBody
    });
}

export const TransferTPoints = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${PublicAPI}transfer-tpoints`,
        data: reqBody
    });
}