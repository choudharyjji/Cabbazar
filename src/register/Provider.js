import axios from 'axios';
import {
    REGISTER,
} from '../constant/Constants'; // endpoint


export const CreateUser = (data, token) => {
    return axios({
        method: 'post',
        url: REGISTER,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
}