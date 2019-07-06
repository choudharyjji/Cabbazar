import axios from 'axios';
import {
    GET_PRICES, CREATE_VISITOR, SLACK_VISITOR, UPDATE_USER, BOOKING_HISTORY
} from '../constant/Constants'; // endpoint


export const GetPrices = (data) => {
    return axios({
        method: 'post',
        url: GET_PRICES,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status <= 500,
    });
};

export const UpdateUser = (token,data) => {
    return axios({
        method: 'put',
        url: UPDATE_USER,
        data:data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const CreateVisitor = (data) => {

    return axios({
        method: 'post',
        url: CREATE_VISITOR,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};


export const SlackCall = (data) => {

    return axios({
        method: 'post',
        url: SLACK_VISITOR.replace(':_data',data),
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};