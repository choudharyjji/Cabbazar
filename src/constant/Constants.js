/*export const BASE = "https://api.cabbazar.com/";*/
export const BASE = "http://api.stage.cabbazar.com/";
//export const BASE = "http://api.cabbazar.com/";

export const LOGIN = BASE + "user/login";
export const REGISTER = BASE + 'user';
export const FORGOT = BASE + 'user/forgot';
export const RESET = BASE + 'user/reset_password';
export const VERIFY_OTP = BASE + 'user/verify_phone';
export const GET_PRICES = BASE + 'fare/estimate';
export const CREATE_VISITOR = BASE + 'visitor';

export const COUPON = BASE + 'coupon/validate';
export const PLACE_BOOKING = BASE + "booking";
export const BOOKING_INITIATED = BASE + "booking/initiated/:_id";
export const BOOKING_HISTORY = BASE + "booking/user";
export const BOOKING_DETAIL = BASE + 'booking/user/:_id';
export const PROFILE = BASE + 'user/user';


export const SLACK_USER = BASE + 'contact/click?clickEvent=:_data';