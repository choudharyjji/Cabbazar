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
         setTimeout(() => {
             this._getStorageValue();
            }, 3000);

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


                    <Image  style={[styles.logoStyle]}
                            source= {require('../../assets/logo_new.png')  } resizeMode="contain"  />

                    <Text style={styles.textStyle}>User App</Text>

            </View>
        );
    }
}
export default WelComeScreen;