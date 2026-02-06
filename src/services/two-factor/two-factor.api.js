import axios from 'axios';
const env = import.meta.env;
const PublicAPI = env.VITE_APP_BACKEND_API_URL
const Prefix = "2fa/"

export const Enable = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}${Prefix}enable`
    });
}

export const EnableConfirmation = async (body, token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}${Prefix}confirm`,
        data: body
    });
}

export const Disable2Factor = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}${Prefix}disable`,
    });
}

export const Cancel2FactorSetup = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'DELETE', 
        url: `${PublicAPI}${Prefix}setup`,
    });
}

export const VerifyFactor = async (token, body) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
            // token,
            'X-2FA-Verification-Id': body?.verification_id,
        },
        method: 'POST', 
        url: `${PublicAPI}${Prefix}verify`,
        data: body
    });
}

export const VerifyFactorBackupCode = async (token, body) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'X-2FA-Verification-Id': body.verificationId,
            'Authorization': `${token}`
        },
        method: 'POST', 
        url: `${PublicAPI}${Prefix}verify/backup`,
        data: body
    });
}

export const ShowBackupVerificationCode = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}${Prefix}show/backup/verification`,
    });
}

export const GenerateBackupCode = async (token) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}${Prefix}generate-backup-codes`,
    });
}

