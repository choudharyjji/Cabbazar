import axios from 'axios';
import {
    BOOKING_DETAIL,
    BOOKING_HISTORY,
} from '../constant/Constants'; // endpoint


export const BookingList = (token) => {
    return axios({
        method: 'get',
        url: BOOKING_HISTORY,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const BookingDetail = (token,id) => {
    return axios({
        method: 'get',
        url: BOOKING_DETAIL.replace(':_id',id),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};