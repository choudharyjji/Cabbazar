import axios from 'axios';
import {
    GET_PRICES,CREATE_VISITOR,SLACK_USER
} from '../constant/Constants'; // endpoint


export const GetPrices = (data) => {
    return axios({
        method: 'post',
        url: GET_PRICES,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};

export const CreateVisitor = (data) => {
    return axios({
        method: 'post',
        url: GET_PRICES,
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
        url: GET_PRICES,
        data:data,
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: status => status >= 200 && status < 500, // default
    });
};