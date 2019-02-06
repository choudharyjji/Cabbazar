import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Image
} from "react-native";
import {createDrawerNavigator,DrawerItems,createStackNavigator} from 'react-navigation';
import styles from './drawer.style';
import HomeScreen from '../home/HomeScreen';
import SideMenu from '../sidemenu/SideMenu';
import PrivacyPolicy from '../staticPages/PrivacyPolicy';
import RefundPolicy from '../staticPages/RefundPolicy';
import Terms from '../staticPages/Terms';
import Login from '../login/Login';
import Register from '../register/Register';
import DetailScreen from '../details/DetailScreen';
import Booking from '../booking/Booking';
import BookingDetailScreen from '../booking/BookingDetailScreen';
import Profile from '../profile/Profile';

const InnerStackNavigator = new createStackNavigator ({
    HomeScreen : {screen : HomeScreen ,navigationOptions : {
            header : null
        }
    },
     PrivacyPolicy : {screen : PrivacyPolicy, navigationOptions : {
             header : null
         }},
     RefundPolicy : {screen : RefundPolicy,
         navigationOptions:{
             header : null
         }},
     Terms : {screen : Terms,
         navigationOptions:{
             header : null,
         }},
     Booking : {screen : Booking,
        navigationOptions:{
        header : null,
                }},
       Profile : {screen : Profile,
        navigationOptions:{
        header : null,
                }},          
    BookingDetailScreen : {screen : BookingDetailScreen, navigationOptions:{
                                     header : null
                                 }},
},{
    navigationOptions : {
        gesturesEnabled :false
    },
})

const LoginStack = createStackNavigator({
    Login: Login,
},{
    initialRouteName: 'Login',
    gesturesEnabled: false,
    header:null
});

const RegisterStack = createStackNavigator({
    Register: Register,
},{
    initialRouteName: 'Register',
    gesturesEnabled: false,
    header:null
});
const customDrawerComponent = (props) => (
    <SafeAreaView>
        <View style={styles.header}>

        </View>
        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
        <View style={styles.body}>
            <Text style={styles.name}>Cabbazar user</Text>
        </View>
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)
const DrawerNavigator = new createDrawerNavigator ({
        HomeScreen : {screen : HomeScreen },
          PrivacyPolicy : {screen : PrivacyPolicy},
          RefundPolicy : {screen : RefundPolicy},
          Terms : {screen : Terms},
          Booking : {screen : Booking, navigationOptions:{
            header : null
            }},
          BookingDetailScreen : {screen : BookingDetailScreen, navigationOptions:{
                header : null
            }},
          DetailScreen : {screen : DetailScreen, navigationOptions:{
            header : null
            }},
          Login: {screen :  Login, navigationOptions:{
            header : null
            }},
            Profile: {screen :  Profile, navigationOptions:{
                header : null
                }},
        InnerStackNavigator : {screen : InnerStackNavigator },
    },
    {
        contentComponent : SideMenu
    }
);
export default DrawerNavigator;