import React, { Component } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    StatusBar,
    AsyncStorage,
    Dimensions
} from "react-native";
import styles from './welcome.style'

class WelComeScreen extends Component {


    componentWillMount() {
         /*setTimeout(() => {
             this.props.navigation.navigate('DrawerNavigator');
            }, 200);*/
        this._getStorageValue();
    }

    async _getStorageValue(){
        const token = await AsyncStorage.getItem('token')
        console.log('LoginToken',token)
        if (token == null) {
            console.log('LoginToken',token)
            this.props.navigation.navigate('Login');

        }else {
            //this.props.navigation.navigate('LoginScreen');
            this.props.navigation.navigate('DrawerNavigator');

        }

    }

    static navigationOptions = {
        header : null
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden />

                <View style = {styles.logoViewStyle}>
                    <Image  style={styles.logoStyle}
                            source= {require('../../assets/ic_launcher.png')  } resizeMode="contain"  />
                </View>
            </View>
        );
    }
}
export default WelComeScreen;