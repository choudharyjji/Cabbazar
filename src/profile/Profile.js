import React, { Component } from "react";
import {
    Alert, AsyncStorage, FlatList, Image, ImageBackground, Modal, ScrollView, StatusBar, TouchableOpacity,
    View
} from "react-native";
import styles from "./profile.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";
import Toast, {DURATION} from 'react-native-easy-toast';
import {GetProfile} from "./Provider";




class Profile extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            mobile:'',
            token:'',
            profile:'',

        }

    }

    componentWillMount(){



        this._getNumberValue();
        this._getToken();
    }

    async _getNumberValue(){
        const number = await AsyncStorage.getItem('number')

        if(number == null){

        }else{
            this.setState({
                mobile:number
            });
        }


    }
    async _getToken(){
        const token = await AsyncStorage.getItem('token')
        console.log('LoginToken',token);
        if(token == null){

        }else{
            this.setState({
                token:token

            });
        }



        this.getUser(token)


    }




    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }




    getUser(token) {

        this.setState({
            loading:true,
        });

        GetProfile(token).then((res) => {

            if (res.status === 200) {
                this.setState({
                    loading: false,
                    profile:res.data
                });


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
    }





    render(){
        const {profile} = this.state;
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        return(
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}>
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-arrow-back' onPress = {()=>this.props.navigation.navigate("HomeScreen")}/>
                    </Left>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                    <Title style={titleStyle}>Profile</Title>
                    </Body>
                    <Right/>
                </Header>

                <ScrollView style={{marginBottom:30}}>
                    <View style={styles.containerContent}>

                        <CardSection style={styles.cardStyle}>

                            <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>


                            <View style={{width:'100%',marginTop:10,padding:5}}>
                                <Text style={{fontSize:12,color:"#d4d4d4"}}>
                                    Name
                                </Text>

                                <Text style={{marginTop:5}}>
                                    {profile.name}
                                </Text>
                                <View style={{width:"100%",height:0.5,backgroundColor:"#d3d3d3",marginTop:3}}/>
                            </View>

                            <View style={{width:'100%',marginTop:10,padding:5}}>
                                <Text style={{fontSize:12,color:"#d4d4d4"}}>
                                    Rating
                                </Text>

                                <Text style={{marginTop:5}}>
                                    {profile.rating}
                                </Text>
                                <View style={{width:"100%",height:0.5,backgroundColor:"#d3d3d3",marginTop:3}}/>
                            </View>

                            <View style={{width:'100%',marginTop:10,padding:5}}>
                                <Text style={{fontSize:12,color:"#d4d4d4"}}>
                                    Email
                                </Text>

                                <Text style={{marginTop:5}}>
                                    {profile.email}
                                </Text>
                                <View style={{width:"100%",height:0.5,backgroundColor:"#d3d3d3",marginTop:3}}/>
                            </View>

                            <View style={{width:'100%',marginTop:10,padding:5}}>
                                <Text style={{fontSize:12,color:"#d4d4d4"}}>
                                    Mobile
                                </Text>

                                <Text style={{marginTop:5}}>
                                    {profile.phone}
                                </Text>
                                <View style={{width:"100%",height:0.5,backgroundColor:"#d3d3d3",marginTop:3}}/>
                            </View>

                            <View style={{width:'100%',marginTop:10,padding:5}}>
                                <Text style={{fontSize:12,color:"#d4d4d4"}}>
                                    Password
                                </Text>

                                <Text style={{marginTop:5}}>
                                    **************
                                </Text>
                                <View style={{width:"100%",height:0.5,backgroundColor:"#d3d3d3",marginTop:3}}/>
                            </View>

                            <Button style={{backgroundColor:'#f5593d',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'90%',marginTop:10,
                                marginBottom:10}}
                                    onPress={()=>this.onClickLogout()}>
                                <Text>Logout</Text>
                            </Button>
                        </CardSection>

                    </View>
                </ScrollView>


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

    onClickLogout(){
        Alert.alert(
            'Are you sure to logout',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress:this.onPressOk.bind(this) },
            ],
            { cancelable: false }
        )
    }
    onPressOk(){
        AsyncStorage.removeItem('token', (err) => {

        });
        AsyncStorage.removeItem('name', (err) => {

        });
        AsyncStorage.removeItem('email', (err) => {

        });
        AsyncStorage.removeItem('number', (err) => {

        });
        this.props.navigation.navigate('Login');

    }



}


export default Profile;