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

export const getLegacyCommissionsTotalCommission = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/commission/legacy/sum`
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

export const validateToken = async (body) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${BaseAPIUrl}validate`,
        data: body
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

export const TransferTBucks = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${PublicAPI}transfer-tbucks`,
        data: reqBody
    });
}

export const WithdrawTBucks = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${PublicAPI}withdraw-tbucks`,
        data: reqBody
    });
}

export const GetUserDetails = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/details`,
    });
}

export const ResendVerificationEmail = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/resend-email-verification`,
    });
}

export const GetUserSponsorDetails = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/sponsor-details`,
    });
}

export const UpdateUserInformation = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST', 
        url: `${BaseAPIUrl}account/update-details`,
        data: reqBody
    });
}

export const UploadFile = async (reqBody, token) => {

    const formData = new FormData();
    
    if (reqBody.file || reqBody.file instanceof FileList) {
        formData.append("file", reqBody.file);
    }

    return await axios({
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
        method: "post",
        url: `${BaseAPIUrl}account/upload-file`,
        data: formData
    })
}

export const ProfileMultipleDownload = async (token, reqBody) => {

    const formData = new FormData();
    
    if (reqBody.file || reqBody.file instanceof FileList) {

        if (reqBody.file && (Array.isArray(reqBody.file) || reqBody.file instanceof FileList)) {
            Array.from(reqBody.file).forEach((fileItem) => {
                formData.append("file[]", fileItem);
            })
        }

    }

    return await axios({
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
        method: "post",
        url: `${BaseAPIUrl}account/upload-multiple-file`,
        data: formData
    })
}

export const GetHomeContents = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: `${BaseAPIUrl}account/contents`,
    });
}

export const getNetworkDetails = async (token, url) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: url ? url : `${BaseAPIUrl}account/connections`,
    });
}

export const getLegacyCommissionsHistoryPaginated = async (token, url) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        url: url ? url : `${BaseAPIUrl}account/commission/legacy/paginated`,
    });
}
