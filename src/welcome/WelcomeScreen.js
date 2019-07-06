import React, { Component } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    StatusBar,
    AsyncStorage,
    Dimensions,
    Animated
} from "react-native";
import styles from './welcome.style'

class WelComeScreen extends Component {

    constructor(props){
        super(props);
        this.state= {
            opacity:new Animated.Value(0),
            fadeIn: new Animated.Value(0),
        }
    }

    fadeIn() {
        this.state.fadeIn.setValue(0)
        Animated.timing(
            this.state.fadeIn,
            {
                toValue: 1,
                duration: 2000,
            }
        ).start();
    }

    onLoad=()=>{
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration:3000,
            useNativeDriver:true,
        }).start();
    }


    componentWillMount() {
        console.disableYellowBox = true;
        setTimeout(() => {
            this._getStorageValue();
        }, 3000);

        setTimeout(() => {
            this.fadeIn();
        }, 1000);

    }

    async _getStorageValue(){
        const token = await AsyncStorage.getItem('token')

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
                    <Animated.Image  onLoad={this.onLoad} style={[styles.logoStyle,
                        {opacity:this.state.opacity,
                            transform:[{
                                scale:this.state.opacity.interpolate({
                                    inputRange:[0,1],
                                    outputRange:[0.85,1]
                                })
                            }]
                        }]}
                                     source= {require('../../assets/cab-logo-final2.png')  } resizeMode="contain"  />

                    <Animated.View
                        style={{opacity: this.state.fadeIn}}
                    >
                        <View>
                            <Text style={styles.textStyle}>User App</Text>
                        </View>
                    </Animated.View>

                </View>
            </View>
        );
    }
}
export default WelComeScreen;