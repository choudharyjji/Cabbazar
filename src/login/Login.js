import React, { Component } from "react";
import styles from "./login.style";
import Loader from "../components/Loader";
import {BackHandler, Image, StatusBar, Text, TextInput, View} from "react-native";
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {CheckUser} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast'
import HomeScreen from "../home/HomeScreen";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



class Login extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            phoneNumber : '' ,
            password : '' ,
            error : '',
            mobileValidate : false
        }
    }


    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

     handleBackButtonClick() {
        BackHandler.exitApp()
    }


    mobileValidate(phoneNumber) {
        const reg = /^[0]?[789]\d{9}$/;
        if (reg.test(phoneNumber) === false) {
            this.setState({
                mobileValidate: false,
                phoneNumber: phoneNumber,
            });
            return false;
        } else {
            this.setState({
                mobileValidate: true,
                phoneNumber: phoneNumber,
            });
            return true;
        }
    }

    showToast(message){
        this.refs.toast.show(message, 500, () => {
            this.props.navigation.navigate("Reset",{phoneNumber: this.state.phoneNumber,from:'Login'})
        });
    }

    checkUser() {
        if(this.state.phoneNumber!==''){
            if(this.state.mobileValidate){
                this.setState({
                    loading: true,
                });

                let data ={
                    phone:this.state.phoneNumber
                };

                CheckUser(data).then((res) =>{
                    if (res.status===200) {

                        this.setState({
                            loading: false,
                        });
                        if(res.data.status==="new"){
                            this.props.navigation.navigate("Register",{phoneNumber: this.state.phoneNumber})

                        }else if(res.data.status==="not_verified"){
                            this.showToast(res.data.message)
                            this.props.navigation.navigate("Reset",{phoneNumber: this.state.phoneNumber})

                        }else if(res.data.status==="existing"){
                            this.props.navigation.navigate("Password",{phoneNumber: this.state.phoneNumber})
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
                alert("Please enter correct mobile number")
            }
        }else{
            alert("Please enter mobile number")
        }

    }



    render(){
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        return (
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />

                <KeyboardAwareScrollView style={styles.containerContent}>
                    <View style={{alignItems:"center",marginTop:"15%"}}>
                        <View style={{height:100,width:100,borderRadius:100/2,backgroundColor:'black',justifyContent:"center",alignItems:'center'}}>
                            <Image  style={{height:40}} source={require("../../assets/logo_new.png")} resizeMode="contain" />

                        </View>
                        <Text style={{fontWeight:"bold"}}>CabBazar Login</Text>
                    </View>
                    <View style={{marginTop:"40%",alignItems:"center"}}>
                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-phone-portrait" size={20} color="#000"/>
                        <Input
                            maxLength={10}
                            keyboardType = 'phone-pad'
                            placeholder = 'Mobile No'
                            value = {this.state.phoneNumber}
                            onChangeText = {phoneNumber =>this.mobileValidate(phoneNumber)}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <Button  children={"Submit"} onPress={()=>this.checkUser()}>
                        </Button>
                    </View>
                    </View>

                </KeyboardAwareScrollView>
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

export default Login;