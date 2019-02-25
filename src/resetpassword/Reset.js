import React, { Component } from "react";
import styles from "./reset.style";
import Loader from "../components/Loader";
import {AsyncStorage, KeyboardAvoidingView, StatusBar, TextInput, View} from "react-native";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {ResetPassword} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast'



class Reset extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            otp : '' ,
            phoneNumber:this.props.navigation.state.params.phoneNumber,
            password : '' ,
            error : ''
        }
    }


    componentWillMount(){

    }

    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
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

        if(token!==null) {
            await AsyncStorage.setItem('email', token)
        }else{
            await AsyncStorage.setItem('email', "")
        }
    };


    checkUser() {

        if(this.state.otp!=='') {
            if(this.state.password!=='') {
                console.log("PAssword: ",this.state.password.length)
                if(this.state.password.length>6) {

                    this.setState({
                        loading: true,
                    });

                    let data ={
                        phone:this.state.phoneNumber,
                        otp:this.state.otp,
                        password:this.state.password
                    };


                    ResetPassword(data).then((res) => {
                        if (res.status === 200) {
                            console.log("res: ", res.data)
                            this.setState({
                                loading: false,
                            });
                            if (res.data.status === "invalid") {
                                this.showToast(res.data.message)
                            } else if (res.data.status === "expired") {
                                this.showToast(res.data.message)
                            } else {
                                this.logInToken(res.data.token);
                                this.logInNumber(this.state.phoneNumber);
                                this.logInName(res.data.details.name);
                                this.logInEmail(res.data.details.email);
                                this.setState({
                                    loading: false,
                                });
                                this.props.navigation.navigate("HomeScreen");
                            }
                        } else {

                            this.setState({
                                loading: false,
                            })
                        }

                    });
                }else{
                    alert("password is week");
                }
            }else{
                alert("Please enter password");
            }
        }else{
            alert("Please enter OTP");
        }

    }

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
                    <Title style={titleStyle}>OTP</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={styles.containerContent}>
                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-key" size={20} color="#000"/>
                        <Input
                            keyboardType = 'phone-pad'
                            placeholder = 'OTP'
                            maxLength={4}
                            value = {this.state.otp}
                            onChangeText = {otp =>this.setState({otp:otp})}
                        />
                    </View>

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
            </View>
        )

    }


}

export default Reset;