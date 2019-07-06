import axios from 'axios';
import {
    USER_WALLET,
    POST_USER_SHARE
} from '../constant/Constants'; // endpoint


export const UserWallet = (token) => {
    return axios({
        method: 'get',
        url: USER_WALLET,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};


export const ShareApp = (token) => {
    return axios({
        method: 'post',
        url: POST_USER_SHARE,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};