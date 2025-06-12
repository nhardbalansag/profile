import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "account/orders/"
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const getPaginatedOrders = async (token, url) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET', 
        // url: `${PublicAPI}paginated`
        url: url ? url : `${PublicAPI}paginated`
    });
}
