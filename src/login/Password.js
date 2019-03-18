import React, { Component } from "react";
import styles from "./login.style";
import Loader from "../components/Loader";
import {KeyboardAvoidingView, StatusBar, TextInput, View, AsyncStorage, TouchableOpacity} from "react-native";
import {Body, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {CheckUser, forgotPassword} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast';
import { Dialog } from 'react-native-simple-dialogs';
import {ResetPassword} from "../resetpassword/Provider";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



class Password extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            password : '' ,
            phoneNumber : this.props.navigation.state.params.phoneNumber ,
            error : '',
            dialog: false,
            otp:'',
            newPassword:''
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

            }).catch((response) => {
                this.setState({
                    loading: false,
                })
                this.showToast("No Internet")

            });
        }else{
            alert("Please enter password")
        }



    }

    forgetPassword(){
        let data = {
            phone:this.state.phoneNumber
        }

        forgotPassword(data).then((res) => {
            if (res.status === 200) {

                this.setState({
                    loading: false,
                    dialog:true
                });
                this.showToast(res.data.message)
            } else {
                this.showToast(res.data.message)
                this.setState({
                    loading: false,
                })
            }

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


    closeModal(){
        this.setState({

            dialog:false,


        })
    }

    resetPassword() {

        if(this.state.otp!=='') {
            if(this.state.newPassword!=='') {
                console.log("PAssword: ",this.state.newPassword.length)
                if(this.state.newPassword.length>6) {

                    this.setState({
                        loading: true,
                    });

                    let data ={
                        phone:this.state.phoneNumber,
                        otp:this.state.otp,
                        password:this.state.newPassword
                    };


                    ResetPassword(data).then((res) => {
                        if (res.status === 200) {
                            console.log("res: ", res.data)
                            this.setState({
                                loading: false,
                                dialog:false
                            });
                            this.showToast(res.data.message)

                        } else {
                            this.showToast(res.data.message)
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
                    <Title style={titleStyle}>Cabbazar</Title>
                    </Body>
                    <Right/>

                </Header>
                <View style={styles.containerPassContent}>
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

                    <View style={styles.checkBoxStyle}>

                        <Text style={{color:'blue',textDecorationLine: 'underline',padding:10,textAlign:'right'}}
                              onPress={()=>this.forgetPassword()}>ForgotPassword</Text>

                    </View>

                </View>



                <Dialog
                    visible={this.state.dialog}
                    onTouchOutside={() => this.setState({dialog: false})} >

                        <View style={{height:200}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{flex:9,marginTop:5,fontSize:20}}>Reset Password</Text>
                                <Icon style={{flex:1,backgroundColor:'transparent'}} name = 'ios-close' onPress = {()=>this.closeModal()}/>
                            </View>

                            <View style={{paddingTop:5,justifyContent:"center",alignItems:"center"}}>
                                <View style={[styles.SectionStyle,{width:"90%"}]}>
                                    <Input
                                        maxLength={4}
                                        keyboardType = 'phone-pad'
                                        placeholder = 'Otp'
                                        value = {this.state.otp}
                                        onChangeText = {otp => this.setState({otp:otp})}
                                    />
                                </View>


                                <View style={[styles.SectionStyle,{width:"90%"}]}>
                                    <Input
                                        secureTextEntry
                                        keyboardType = 'default'
                                        placeholder = 'New Password'
                                        value = {this.state.newPassword}
                                        onChangeText = {newPassword => this.setState({newPassword:newPassword})}
                                    />
                                </View>

                            </View>

                            <TouchableOpacity style={{
                                height:50,backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'100%',marginTop:10,
                                borderRadius:5}}
                                              onPress={()=>this.resetPassword()}>
                                <Text style={{color:"white"}}>Reset</Text>
                            </TouchableOpacity>



                        </View>

                </Dialog>

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