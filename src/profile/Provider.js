import axios from 'axios';
import {
   PROFILE,
} from '../constant/Constants'; // endpoint




export const GetProfile = (token) => {
    return axios({
        method: 'get',
        url: PROFILE,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status <= 500, // default
    });
};