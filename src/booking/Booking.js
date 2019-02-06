import React, { Component } from "react";
import {AsyncStorage, FlatList, Image, ImageBackground, Modal, StatusBar, TouchableOpacity, View} from "react-native";
import styles from "./booking.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";

import Toast, {DURATION} from 'react-native-easy-toast';
import {BookingList} from "./Provider";




class Booking extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            token:'',
            mobile:'',
            bookingList:[]
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

        if(token == null){

        }else{
            this.getBookingHistory(token);
            this.setState({
                token:token
            });
        }


    }

    openDetailBookingScreen(id,itinerary) {
        console.log("Pressed here ")
        this.props.navigation.navigate("BookingDetailScreen",{id:id,itinerary:itinerary})
    }


    renderFareItem = (booking) =>{

        return(
            <CardSection key={booking.index} style={styles.cardFare} >
                <TouchableOpacity style={{width:"100%"}} onPress={()=>this.openDetailBookingScreen(booking.item._id,booking.item.itinerary)}>
                {booking.item.isReturn?<Text style={{fontWeight:"bold",padding:5}}>Round Trip</Text>:<Text style={{fontWeight:"bold",padding:5}}>One Way</Text>}

                    <View style={{width:"100%",padding:5,flexDirection:"row"}}>
                        <Text>Booking Id : </Text>
                        <Text style={{fontWeight:"bold",paddingLeft:5}}>{booking.item.bookingId}</Text>
                    </View>

                    <View style={{width:'100%',marginTop:10,height:0.5,backgroundColor:"#d3d3d3"}}>

                    </View>


                {booking.item.itinerary.map((place,index)=>{
                    return(
                        <View style={{padding:5,width:"100%",flexDirection:"row",alignItems:"center"}} key={index}>
                            {index===0?<Icon name = 'ios-locate' style={{color:"green"}} />:<Icon name = 'ios-locate' style={{color:"red"}} />}
                            <Text style={{paddingLeft:5}}>{place.address}</Text>
                        </View>
                    )
                })}

                <View style={{backgroundColor:"black",justifyContent:"center",alignItems:"center",padding:5,position:"absolute",right:"-3%",top:"1%"
                    ,borderTopLeftRadius:10,borderBottomLeftRadius:10}}>
                    <Text style={{color:"white"}}>Payment: {booking.item.paymentStatus}</Text>
                </View>

                </TouchableOpacity>
            </CardSection>

        )
    };


    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }

    getBookingHistory(token) {

        this.setState({
            loading: true,
        });

        BookingList(token).then((res) => {
            if (res.status === 200) {
                this.setState({
                    loading: false,
                    bookingList:res.data
                });


            } else {
                this.showToast(res.data.message)
                this.setState({
                    loading: false,
                })
            }

        });

    }


    render(){

        console.log(this.state.bookingList)
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
                    <Title style={titleStyle}>Booking History</Title>
                    </Body>
                    <Right/>
                </Header>


                <View style={styles.containerContent}>
                    <FlatList
                        data={this.state.bookingList}
                        renderItem={this.renderFareItem}
                        keyExtractor={ (item, index) => index.toString()}
                    />
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


export default Booking;