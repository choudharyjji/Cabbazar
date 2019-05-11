import axios from 'axios';
import {
    SHARE_POST,
} from '../constant/Constants'; // endpoint


export const PostEnquiry = (data, token) => {
    return axios({
        method: 'post',
        url: SHARE_POST,
        data:data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
}