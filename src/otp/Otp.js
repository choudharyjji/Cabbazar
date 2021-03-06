import React, { Component } from "react";
import styles from "./otp.style";
import Loader from "../components/Loader";
import {AsyncStorage, KeyboardAvoidingView, StatusBar, TextInput, View} from "react-native";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {CheckOtp} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast'



class Otp extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            otp : '' ,
            phoneNumber:this.props.navigation.state.params.phoneNumber,
            from:this.props.navigation.state.params.from,
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
        if(this.state.otp!==''){

                this.setState({
                    loading: true,
                });

                let data ={
                    phone:this.state.phoneNumber,
                    otp:this.state.otp
                };

                console.log("Data: ",data)

                CheckOtp(data).then((res) =>{
                    if (res.status===200) {

                        this.setState({
                            loading: false,
                        });
                        if(res.data.status==="invalid"){
                           this.showToast(res.data.message)
                        }else if(res.data.status==="expired") {
                            this.showToast(res.data.message)
                        }else{
                            if(this.state.from==="Register") {
                                this.logInToken(res.data.token);
                                this.logInNumber(this.state.phoneNumber);
                                this.logInName(res.data.details.name);
                                this.logInEmail(res.data.details.email);
                                this.props.navigation.navigate("HomeScreen", {phoneNumber: this.state.phoneNumber})
                            }
                        }
                    }else {

                        this.setState({
                            loading: false,
                        })
                    }

                }).catch((response) => {
                    this.setState({
                        loading: false,
                    })
                    this.showToast("No Internet")

                });

        }else{
            alert("Please enter OTP")
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

export default Otp;