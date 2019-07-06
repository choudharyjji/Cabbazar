import axios from 'axios';
import {
    BOOKING_INITIATED,
    COUPON, PLACE_BOOKING,
    USER_WALLET_BALANCE
} from '../constant/Constants'; // endpoint


export const UserWalletBalance = (token,price) => {
    return axios({
        method: 'get',
        url: USER_WALLET_BALANCE+price,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const CheckCoupon = (data, token) => {
    return axios({
        method: 'post',
        url: COUPON,
        data:data,
        headers: {
            'Content-Type': 'application/json',

        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const PlaceBooking = (data, token) => {
    return axios({
        method: 'post',
        url: PLACE_BOOKING,
        data:data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const BookingInitiated = (token,id) => {
    return axios({
        method: 'post',
        url: BOOKING_INITIATED.replace(':_id',id),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};