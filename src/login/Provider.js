import axios from 'axios';
import {
    LOGIN,FORGOT
} from '../constant/Constants'; // endpoint


export const CheckUser = (data, token) => {
    return axios({
        method: 'post',
        url: LOGIN,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status <= 500, // default
    });
}

export const forgotPassword = (data, token) => {
    return axios({
        method: 'post',
        url: FORGOT,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status <= 500, // default
    });
}