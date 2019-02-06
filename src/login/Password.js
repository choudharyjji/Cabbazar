import React, { Component } from "react";
import styles from "./login.style";
import Loader from "../components/Loader";
import {KeyboardAvoidingView, StatusBar, TextInput, View,AsyncStorage} from "react-native";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {CheckUser} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast'



class Password extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            password : '' ,
            phoneNumber : this.props.navigation.state.params.phoneNumber ,
            error : '',
        }
    }


    showToast(message){
        this.refs.toast.show(message, 500, () => {
        });
    }

    checkUser() {
        if(this.state.password!=='') {
            this.setState({
                loading: true,
            });

            let data = {
                phone: this.state.phoneNumber,
                password: this.state.password
            };
            console.log("Data : ", data)
            CheckUser(data).then((res) => {
                if (res.status === 200) {
                    console.log("res: ", res.data);
                    this.logInToken(res.data.token);
                    this.logInNumber(this.state.phoneNumber);
                    this.logInName(res.data.details.name);
                    this.logInEmail(res.data.details.email);

                    this.setState({
                        loading: false,
                    });
                    this.props.navigation.navigate("HomeScreen");
                } else {
                    this.showToast(res.data.message)
                    this.setState({
                        loading: false,
                    })
                }

            });
        }else{
            alert("Please enter password")
        }



    }

    logInToken = async (token) => {
        await AsyncStorage.setItem('token',token)
    };

    logInNumber = async (token) => {
        await AsyncStorage.setItem('number',token)
    };

    logInName = async (token) => {
        await AsyncStorage.setItem('name',token)
    };

    logInEmail = async (token) => {
        await AsyncStorage.setItem('email',token)
    };



    render(){
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        return (
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}>
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-arrow-back' onPress = {()=>this.props.navigation.navigate("Login")}/>
                    </Left>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                    <Title style={titleStyle}>Cabbazar</Title>
                    </Body>
                    <Right/>

                </Header>
                <View style={styles.containerContent}>
                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-lock" size={20} color="#000"/>
                        <Input
                            secureTextEntry
                            keyboardType = 'default'
                            placeholder = 'Password'
                            value = {this.state.password}
                            onChangeText = {password =>this.setState({password:password})}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <Button  children={"Submit"} onPress={()=>this.checkUser()}>
                        </Button>
                    </View>

                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'black',padding:5}}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </View>
        )

    }


}

export default Password;