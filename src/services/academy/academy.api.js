import axios from 'axios';

const env = import.meta.env;

const PublicAPI = env.VITE_APP_BACKEND_API_URL + "account/"
const BaseAPIUrl = env.VITE_APP_BACKEND_API_URL

export const getAllCoursesContents = async (token, reqBody) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`,
            ...token
        },
        method: 'POST', 
        url: `${PublicAPI}courses`,
        data: reqBody
    });
}

export const getCoursesContents = async (token, id) => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${token}`
            ...token
        },
        method: 'GET', 
        url: `${PublicAPI}courses/view/${id}`
    });
}
