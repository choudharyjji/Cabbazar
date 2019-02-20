import React, { Component } from "react";
import styles from "./register.style";
import Loader from "../components/Loader";
import { KeyboardAvoidingView, StatusBar,  TextInput, View} from "react-native";
import {Body,  Header, Icon, Left, ListItem, Right, Text, Title} from "native-base";
import AppTheme from "../components/AppTheme.style";
import Button from '../components/Button'
import {Input} from "../components/Input";
import {CreateUser} from "./Provider";
import { CheckBox } from 'react-native-elements'
import Toast, {DURATION} from 'react-native-easy-toast'



class Register extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            phoneNumber : this.props.navigation.state.params.phoneNumber ,
            password : '' ,
            error : '',
            name:'',
            email:'',
            terms:false,
            emailValidate:false,
            passwordValidate:false,
        }
    }


    componentWillMount(){

    }

    emailValidate(email) {
        const reg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (reg.test(email) === false) {
            this.setState({
                emailValidate: false,
                email: email,
            });
            return false;
        } else {
            this.setState({
                emailValidate: true,
                email: email,
            });
            return true;
        }
    }

    passwordValidate(password) {

        if (password.length>6) {
            this.setState({
                passwordValidate: true,
                password: password,
            });
            return false;
        } else {
            this.setState({
                passwordValidate: false,
                password: password,
            });
            return true;
        }
    }

    showToast(message){
        this.refs.toast.show(message, 500, () => {
            this.props.navigation.navigate("Otp",{phoneNumber: this.state.phoneNumber,from:"Register"})
        });
    }

    createUser() {
        if(this.state.name!==''){
            if(this.state.email!=='') {
                if (this.state.emailValidate) {
                    if (this.state.password!=='') {
                        if (this.state.passwordValidate) {
                            if(this.state.terms) {
                                this.setState({
                                    loading: true,
                                });

                                let data = {
                                    phone: this.state.phoneNumber,
                                    name : this.state.name,
                                    email: this.state.email,
                                    password: this.state.password,
                                    isTermsAccepted: this.state.terms
                                };


                                CreateUser(data).then((res) => {
                                    if (res.status === 200) {
                                        console.log("res: ", res.data);
                                        this.setState({
                                            loading: false,
                                        });
                                        this.showToast(res.data.message)
                                    } else {
                                        this.setState({
                                            loading: false,
                                        })
                                    }

                                });
                            }else{
                                alert("Please check terms and condition")
                            }
                        }else{
                            alert("Password is week")
                        }
                    }else{
                        alert("Please enter password")
                    }
                } else {
                    alert("Please enter correct email")
                }
            }else{
                alert("Please enter email")
            }
        }else{
            alert("Please enter name")
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
                    <Title style={titleStyle}>Register</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={styles.containerContent}>
                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-person" size={20} color="#000"/>
                        <Input
                            keyboardType = 'default'
                            placeholder = 'Name'
                            value = {this.state.name}
                            onChangeText = {name => this.setState({name:name})}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-mail" size={20} color="#000"/>
                        <Input
                            keyboardType = 'email-address'
                            placeholder = 'Email'
                            value = {this.state.email}
                            onChangeText = {email =>this.emailValidate(email)}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <Icon style={styles.searchIcon} name="ios-lock" size={20} color="#000"/>
                        <Input
                            secureTextEntry
                            keyboardType = 'default'
                            placeholder = 'Password'
                            value = {this.state.password}
                            onChangeText = {password =>this.passwordValidate(password)}
                        />
                    </View>

                    <View style={styles.checkBoxStyle}>

                        <CheckBox
                            onPress={() => this.setState({terms:!this.state.terms})}
                            iconRight
                            center
                            checkedColor='blue'
                            checked={this.state.terms}
                            size = {24}
                            containerStyle={{ marginLeft: 0, marginRight: 0, borderWidth: 0 ,backgroundColor:'transparent'}}/>

                        <Text style={{color:'blue',paddingLeft:5}}>Terms and Condition</Text>

                    </View>

                    <View style={styles.SectionStyle}>
                        <Button  children={"Submit"} onPress={()=>this.createUser()}>
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

export default Register;