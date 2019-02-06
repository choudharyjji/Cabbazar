const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  resolver: {
    blacklistRE: blacklist([/Users\/deepanshurustagi\/projects\/react_native\/cabbazaruser\/cabbazar_user\/node_modules\/react-native-razorpay\/node_modules\/.*/])
  }
};