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
