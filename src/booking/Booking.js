import React, { Component } from "react";
import {AsyncStorage, FlatList, Image, ImageBackground, Modal, StatusBar, TouchableOpacity, View} from "react-native";
import styles from "./booking.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";

import Toast, {DURATION} from 'react-native-easy-toast';
import {BookingList} from "./Provider";
import moment from "moment/moment";




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

    openDetailBookingScreen(id,itinerary,status,bookingStatus) {
        console.log("Bookingstatus : ",bookingStatus)

        if(status==="success" && (bookingStatus!=="pending" && bookingStatus!=="cancelled")) {
            this.props.navigation.navigate("BookingDetailScreen", {id: id, itinerary: itinerary})
        }else{

        }
    }


    renderFareItem = (booking) =>{
        let colorStatus;
        let colorPayment;

        if(booking.item.status==="pending"){
            colorStatus = "#EFCC00";
        }else if(booking.item.status==="cancelled"){
            colorStatus = "#EB0C14";
        }else{
            colorStatus = "#0F9200";

        }

        if(booking.item.paymentStatus==="initiated"){
            colorPayment = "#EFCC00";
        }else{
            colorPayment = "#0F9200";
        }

        return(
            <CardSection key={booking.index} style={styles.cardFare} >
                <TouchableOpacity style={{width:"100%"}} onPress={()=>
                    this.openDetailBookingScreen(booking.item._id,booking.item.itinerary,booking.item.paymentStatus,booking.item.status)}>
                    {booking.item.isReturn?<Text style={{fontWeight:"bold",padding:5}}>Round Trip ({booking.item.carType})</Text>
                        :<Text style={{fontWeight:"bold",padding:5}}>One Way ({booking.item.carType})</Text>}

                    <View style={{width:"100%",marginTop:10,padding:5,flexDirection:"row"}}>
                        <Text style={{flex:1}}>Booking Id : </Text>
                        <Text style={{fontWeight:"bold",paddingLeft:5,flex:1}}>{booking.item.bookingId}</Text>
                    </View>

                    <View style={{width:"100%",padding:5,flexDirection:"row"}}>
                        <Text style={{flex:1}}>Departure date/time : </Text>
                        <Text style={{fontWeight:"bold",paddingLeft:5,flex:1}}>
                            {moment.unix(booking.item.departureAt).format("DD-MM-YYYY HH:mm")}
                        </Text>
                    </View>

                    {booking.item.isReturn?
                        <View style={{width:"100%",padding:5,flexDirection:"row"}}>
                            <Text style={{flex:1}}>Arrival date/time : </Text>
                            <Text style={{fontWeight:"bold",paddingLeft:5,flex:1}}>
                                {moment.unix(booking.item.arrivalAt).format("DD-MM-YYYY HH:mm")}
                            </Text>
                        </View>
                        :
                        null
                    }


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

                    <View style={{backgroundColor:"black",padding:5,position:"absolute",right:"-3%",top:"1%"
                        ,borderTopLeftRadius:10,borderBottomLeftRadius:10}}>
                        <Text style={{color:colorStatus,fontSize:12,marginBottom:5,}}>Status: {booking.item.status.toUpperCase()}</Text>

                        <Text style={{color:colorPayment,fontSize:12,fontWeight:"bold"}}>Payment: {booking.item.paymentStatus.toUpperCase()}</Text>
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