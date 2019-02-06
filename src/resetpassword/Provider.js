import axios from 'axios';
import {
    RESET,
} from '../constant/Constants'; // endpoint


export const ResetPassword = (data, token) => {
    return axios({
        method: 'post',
        url: RESET,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
}