import React, { Component } from "react";
import {AsyncStorage, FlatList, Image, ImageBackground, Modal, StatusBar, TouchableOpacity, View} from "react-native";
import styles from "./booking.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";

import Toast, {DURATION} from 'react-native-easy-toast';
import {BookingDetail, BookingList} from "./Provider";




class BookingDetailScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            id:this.props.navigation.state.params.id,
            itinerary:this.props.navigation.state.params.itinerary,
            loading:false,
            responseData:'',
            token:'',
            mobile:'',

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
            this.getBookingDetail(token);
            this.setState({
                token:token
            });
        }


    }


    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }

    getBookingDetail(token) {

        this.setState({
            loading: true,
        });

        BookingDetail(token,this.state.id).then((res) => {
            console.log("Data",res.data)
            if (res.status === 200) {
                this.setState({
                    responseData:res.data,
                    loading: false,

                });


            } else {
                this.showToast(res.responseData.message)
                this.setState({
                    loading: false,
                })
            }

        });

    }


    render(){

        const {responseData} = this.state;

        console.log("in render: ",responseData);
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        return(
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}>
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-arrow-back' onPress = {()=>this.props.navigation.navigate("Booking")}/>
                    </Left>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                    <Title style={titleStyle}>Booking Detail</Title>
                    </Body>
                    <Right/>
                </Header>


                <View style={styles.containerContent}>
                    <CardSection style={styles.cardFare}>
                        {responseData.isReturn?<Text style={{fontWeight:"bold",padding:5}}>Round Trip</Text>:<Text style={{fontWeight:"bold",padding:5}}>One Way</Text>}

                        <View style={{width:"100%",padding:5,flexDirection:"row"}}>
                            <Text>Booking Id : </Text>
                            <Text style={{fontWeight:"bold",paddingLeft:5}}>{responseData.bookingId}</Text>
                        </View>

                        <View style={{width:'100%',marginTop:10,height:0.5,backgroundColor:"#d3d3d3"}}>

                        </View>


                        {this.state.itinerary.map((place,index)=>{
                            return(
                                <View style={{padding:5,width:"100%",flexDirection:"row",alignItems:"center"}} key={index}>
                                    {index===0?<Icon name = 'ios-locate' style={{color:"green"}} />:<Icon name = 'ios-locate' style={{color:"red"}} />}
                                    <Text style={{paddingLeft:5}}>{place.address}</Text>
                                </View>
                            )
                        })}

                        <View style={{backgroundColor:"black",justifyContent:"center",alignItems:"center",padding:5,position:"absolute",right:0,top:"5%"
                            ,borderTopLeftRadius:10,borderBottomLeftRadius:10}}>
                            <Text style={{color:"white"}}>Payment: {responseData.paymentStatus}</Text>
                        </View>


                    </CardSection>

                    <CardSection style={styles.cardFare}>

                        <Text style={{fontWeight:"bold",padding:5}}>Payment Details: </Text>

                        <View style={{width:"100%",padding:5}}>
                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>


                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1}}>Estimated Price:</Text>
                                        :<Text style={{flex:1}}>Final Price:</Text>
                                    }

                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.estimatedPriceCb}
                                    </Text>:
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.finalPriceCb}
                                        </Text>}


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>


                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1}}>Estimated GST:</Text>
                                        :<Text style={{flex:1}}>Final GST:</Text>
                                    }

                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.estimatedGst}
                                        </Text>:
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.finalGst}
                                        </Text>}


                                </View>
                            </View>
                            <View style={{width:'100%',marginTop:10,height:0.5,backgroundColor:"#d3d3d3"}}>

                            </View>


                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>


                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1}}>Total Estimated Price:</Text>
                                        :<Text style={{flex:1}}>Total Final Price:</Text>
                                    }

                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.estimatedGst+responseData.estimatedPriceCb}
                                        </Text>:
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                            &#8377;{responseData.finalGst+responseData.finalPriceCb}
                                        </Text>}


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10,height:0.5,backgroundColor:"#d3d3d3"}}>

                            </View>

                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>

                                        <Text style={{flex:1}}>Advance Paid:</Text>

                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold",color:"green"}}>
                                            &#8377;{responseData.advanceAmount}
                                        </Text>


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>


                                    {responseData.status!=="completed"?
                                        <Text style={{flex:2}}>Remaining Estimated Price:</Text>
                                        :<Text style={{flex:1}}>Remaining Price:</Text>
                                    }

                                    {responseData.status!=="completed"?
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold",color:'red'}}>
                                            &#8377;{responseData.estimatedPriceCb-responseData.estimatedCbFare}
                                        </Text>:
                                        <Text style={{flex:1,textAlign:"right",fontWeight:"bold",color:'red'}}>
                                            &#8377;{responseData.finalPriceCb-responseData.finalCbFare}
                                        </Text>}


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10,height:0.5,backgroundColor:"#d3d3d3"}}>

                            </View>



                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>

                                    <Text style={{flex:1}}>Driver Allowance</Text>

                                    <Text style={{flex:1,textAlign:"right",fontWeight:"bold",color:"green"}}>
                                        Included
                                    </Text>


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>

                                    <Text style={{flex:1}}>Included Km </Text>

                                    <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                        {responseData.includedKm}Km
                                    </Text>


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10}}>
                                <View style={{flexDirection:'row'}}>

                                    <Text style={{flex:1}}>Extra Km Charge</Text>

                                    <Text style={{flex:1,textAlign:"right",fontWeight:"bold"}}>
                                        &#8377;{responseData.pricePerExtraKmCb}/Km
                                    </Text>


                                </View>
                            </View>

                            <View style={{width:'100%',marginTop:10,justifyContent:"center",alignItems:"center"}}>


                                {responseData.isFixedRoute?
                                    <Text style={{fontWeight:"bold"}}>Toll Tax, State Tax, Parking Included</Text>
                                    :<Text style={{fontWeight:"bold"}}>Toll Tax, State Tax, Parking Extra</Text>}

                            </View>


                        </View>

                    </CardSection>

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


export default BookingDetailScreen;