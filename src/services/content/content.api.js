import axios from 'axios';

const PublicAPI = 'http://clubten.localtest.me:80/api/public/'

export const GetHomeContents = async () => {
    return await axios({ 
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET', 
        url: `${PublicAPI}contents`
    });
}