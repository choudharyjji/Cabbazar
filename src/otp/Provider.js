import axios from 'axios';
import {
    VERIFY_OTP,
} from '../constant/Constants'; // endpoint


export const CheckOtp = (data, token) => {
    return axios({
        method: 'post',
        url: VERIFY_OTP,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status <= 500, // default
    });
}