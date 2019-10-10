import React, {Component} from 'react';
import {createStackNavigator ,createSwitchNavigator} from 'react-navigation';
import { StyleSheet, Text, View ,AsyncStorage,Alert} from 'react-native';

import WelcomeScreen from './welcome/WelcomeScreen';
import HomeScreen from "./home/HomeScreen";
import DrawerNavigator from './navigator/DrawerNavigator'
import Login from "./login/Login";
import Register from './register/Register';
import Otp from './otp/Otp';
import Password from './login/Password';
import Reset from './resetpassword/Reset';
import firebase from "react-native-firebase";

class App extends Component{

    state = {
        fontLoaded: false,
    };

    async componentDidMount() {

    }

    render() {


            return (

                <AppStackNavigator/>

            );

    }
}

const switchNavigator = new createSwitchNavigator({
    WelComeScreen : {screen : WelcomeScreen},

    Login : {screen : Login,navigationOptions:{
            header : null
        }},
});

const AppStackNavigator = new createStackNavigator({
        switchNavigator : {screen : switchNavigator,    navigationOptions : {
                header : null
            }
        },
        Register : {screen : Register, navigationOptions:{
                header : null
            }},
        Otp : {screen : Otp, navigationOptions:{
                header : null
            }},
        Password : {screen : Password, navigationOptions:{
                header : null
            }},
        Reset : {screen : Reset, navigationOptions:{
                header : null
            }},
        DrawerNavigator : {screen : DrawerNavigator ,
            navigationOptions : {
                header : null
            }
        },
    },
    {
        navigationOptions : {
            gesturesEnabled :false
        },
    }
);


export default App;


