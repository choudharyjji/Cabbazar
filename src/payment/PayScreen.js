import React, { Component } from "react";
import {
    AsyncStorage, FlatList, Image, ImageBackground, Modal, ScrollView, StatusBar, TouchableHighlight, TouchableOpacity,
    View
} from "react-native";
import styles from "../details/detail.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";
import { Dialog } from 'react-native-simple-dialogs';
import {Input} from "../components/Input";
import {CheckCoupon,PlaceBooking,BookingInitiated} from "../details/Provider";
import Toast, {DURATION} from 'react-native-easy-toast';
import RazorpayCheckout from 'react-native-razorpay';
import moment from "moment";



class PayScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            itinerary:this.props.navigation.state.params.itinerary,
            response :this.props.navigation.state.params.response,
            fareChart :this.props.navigation.state.params.fareChart,
            fare : this.props.navigation.state.params.item,
            modalVisible:false,
            paymentDialog:false,
            advanceAmount:'',
            coupon:'',
            amountCb:'',
            mobile:'',
            couponApplied:false,
            couponMessage:'',
            cardId:'',
            token:'',
            bookingId:'',
            options:''
        }

    }

    componentWillMount(){

        this._getNumberValue();
        this._getToken();

    }

    componentDidMount(){
        this.setState({
            advanceAmount:this.state.fare.advanceAmount
        })
    }

    async _getNumberValue(){
        const number = await AsyncStorage.getItem('number')
        console.log('LoginToken',number);
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
            this.placeBooking(null,token);
        }


    }

    renderItem = (place,index) =>{

        return(
            <View key={place.index} style={{flexDirection:'row',alignItems:'center'}} >
                <View style={{backgroundColor:"rgb(240,162,81)",borderRadius:10,height:35,justifyContent:'center',alignItems:'center',marginLeft:2.5,marginRight:2.5,padding:2}}>
                    <Text style={styles.listText}>
                        {place.item.address}
                    </Text>
                </View>

                {place.index<this.state.itinerary.length-1
                    ? <Icon style={{padding:0,marginLeft:5}} name = 'ios-arrow-forward'/>

                    :null
                }
            </View>
        )
    };




    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }

    onSelectItem (){
        this.setState({
            modalVisible:true
        })
    }

    openPaymentModal(amount,amountCb,id){
        console.log("Id: ",id)
        this.setState({
            advanceAmount:amount,
            paymentDialog:true,
            amountCb:this.state.fare.journeyPriceCb,
            carId:id
        })
    }

    closeModal(){
        this.setState({
            modalVisible:false,
            paymentDialog:false,
            couponApplied:false,

        })
    }

    goCoupon() {

        if(this.state.coupon!=='') {
            let data = {
                couponCode: this.state.coupon,
                phone: this.state.mobile,
                journeyPrice: this.state.fare.journeyPriceCb
            };
            this.setState({
                loading: true,
            })



            CheckCoupon(data).then((res) => {
                console.log("res: ", res.data)
                if (res.status === 200) {
                    this.setState({
                        loading: false,
                        couponApplied:res.data.isCouponApplied
                    });
                    if(res.data.isCouponApplied){
                        this.showToast(res.data.message)

                        this.setState({
                            couponMessage:res.data.message,
                            coupon: res.data.couponCode
                        })
                        this.placeBooking(res.data.couponCode,this.state.token);
                    }else{
                        this.showToast(res.data.message)
                    }

                } else {
                    this.showToast(res.data.message)
                    this.setState({
                        loading: false,
                    })
                }

            });
        }else{
            alert("Please enter coupon.")
        }

    }

    placeBooking(coupon,token) {
        let data = {
            isReturn:this.state.response.details.isReturn ,
            itinerary: this.state.itinerary,
            departureAt: this.state.response.details.departureAt,
            arrivalAt:  this.state.response.details.arrivalAt,
            carId: this.state.fare._id,
            couponCode: coupon
        };
        this.setState({
            loading: true,
        });

        console.log("Data: ",data)
        PlaceBooking(data,token).then((res) => {
            console.log("res: ", res.data)
            if (res.status === 200) {
                this.setState({
                    loading: false,
                    advanceAmount:res.data.amount/100,
                    bookingId:res.data.notes[1]
                });

                this.openRazorPay(res.data)

            } else {
                this.showToast(res.data.message)
                this.setState({
                    loading: false,
                })
            }

        });
    }


    bookingInitiated() {

        BookingInitiated(this.state.token,this.state.bookingId).then((res) => {
            console.log("res: ", res.data)
            if (res.status === 200) {
                this.setState({
                    loading: false,

                });

                this.props.navigation.navigate("Booking");

            } else {
                this.showToast(res.data.message)
                this.setState({
                    loading: false,
                })
            }

        });
    }

    openRazorPay(data){
        let options = {
            description: 'Advance booking amount payment',
            image: 'https://cabbazar.com/assets/img/logo/featured-image.jpg',
            currency: 'INR',
            key: 'rzp_test_6KeUReJYTLhPt0',
            amount:data.amount ,
            name: 'Cab Bazar LLP',
            notes:data.notes,
            external: {
                wallets: ['paytm']
            },
            prefill: {
                email: data.email,
                contact: data.phone,
                name: data.name
            },
            theme: {color: '#000000'}
        };

        this.setState({
            options:options
        })

    }






    render(){
        let image;
        let price;
        let cars;

        if(this.state.fare.carType==="suv"){
            image = require('../../assets/suv.png')
            cars = "Innova, Xylo or Similar";
        }else if(this.state.fare.carType==="sedan"){
            image = require('../../assets/sedan.png')
            cars = "Dzire, Etios or Similar";
        }else if(this.state.fare.carType==="hatchback"){
            image = require('../../assets/hatchback.png')
            cars = "Indica, Swift or Similar";
        }
        let percentage = 100 - this.state.fare.offerPercentage;

        price  = (this.state.fare.estimatedPriceCb * 100)/percentage;
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        return(
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}>
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-arrow-back' onPress = {()=>
                            this.props.navigation.navigate("DetailScreen",{itinerary:this.state.itinerary,response:this.state.response,fareChart:this.state.fareChart})}
                            />
                    </Left>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                    <Title style={titleStyle}>Confirm and Pay</Title>
                    </Body>
                    <Right/>
                </Header>

                <View style={styles.containerContent}>
                    <ScrollView>
                    <CardSection  style={styles.cardFare}>


                        <Image source={image} style={{height:100,width:250,marginTop:'5%'}}/>

                        <ImageBackground source={require('../../assets/offer-badge.png')} style={{height:70,width:70,position:'absolute',top:'5%',left:'7%',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{alignSelf:'center',fontWeight: 'bold',fontSize: 20,color:'white'}}>{this.state.fare.offerPercentage}%</Text>
                            <Text style={{alignSelf:'center',fontWeight: 'bold',fontSize: 17,color:'white'}}>OFF</Text>
                        </ImageBackground>

                        <Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid',color:"red",fontSize: 20}}>&#8377;{price.toFixed(0)}</Text>

                        <Text style={{color:"#01c501",fontSize: 25,fontWeight: 'bold'}}>&#8377;{this.state.fare.estimatedPriceCb}</Text>
                        <Text style={{color:"#51bcda",fontSize: 15,fontWeight: 'bold'}}>{this.state.fare.carType.toUpperCase()}(AC)</Text>

                        <Text style={{fontSize: 20,marginTop:5}}>{cars}</Text>

                        <View
                            style={{
                                borderBottomColor: '#f1eae0',
                                borderBottomWidth: 1,
                                width:'90%',
                                marginTop:10
                            }}
                        />

                        <View style={{width:'90%',marginTop:10}}>
                            <View style={{flexDirection:'row'}}>

                                <Text style={{flex:1}}>
                                    Included KM
                                </Text>

                                <Text style={{flex:1,textAlign:"right"}}>
                                    {this.state.fare.includedKm}Km
                                </Text>

                            </View>
                        </View>
                        <View style={{width:'90%',marginTop:10}}>
                            <View style={{flexDirection:'row'}}>

                                <Text style={{flex:1}}>
                                    Extra Fare/KM
                                </Text>

                                <Text style={{flex:1,textAlign:"right"}}>
                                    &#8377;{this.state.response.details.isReturn?this.state.fare.oneWayPricePerKmCb:this.state.fare.roundTripPricePerKmCb}/km
                                </Text>

                            </View>
                        </View>
                        <View style={{width:'90%',marginTop:10}}>
                            <View style={{flexDirection:'row'}}>

                                <Text style={{flex:1}}>
                                    Driver Charges
                                </Text>

                                <Text style={{flex:1,textAlign:"right"}}>
                                    Included
                                </Text>

                            </View>
                        </View>

                        <TouchableOpacity style={{backgroundColor:'transparent',alignSelf:'center'}} onPress={this.onSelectItem.bind(this)}>
                            <Text style={{fontSize: 15,marginTop:5,color:'black',textDecorationLine: 'underline',fontWeight: 'bold'}}>Other Terms</Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                borderBottomColor: '#f1eae0',
                                borderBottomWidth: 1,
                                width:'90%',
                                marginTop:5
                            }}
                        />


                        {!this.state.couponApplied?<View style={{flexDirection:'row',paddingTop:5}}>

                                <View style={styles.SectionStyle}>
                                    <Input
                                        keyboardType = 'default'
                                        placeholder = 'Coupon'
                                        value = {this.state.phoneNumber}
                                        onChangeText = {coupon => this.setState({coupon:coupon.toUpperCase()})}
                                    />
                                </View>

                                <Button style={{flex:3,backgroundColor:'#f5593d',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'100%',marginTop:10,height:40}}
                                        onPress={()=>this.goCoupon()}>
                                    <Text>Apply</Text>
                                </Button>
                            </View>:
                            <View style={{width:'100%', justifyContent:'center',alignItems:'center',height:100}}>
                                <Text style={{fontSize:20,fontWeight:'bold',color:'#01c501',textAlign:'center'}}>{this.state.couponMessage}</Text>
                            </View>
                        }



                        <Button style={{backgroundColor:'#f5593d',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'100%',marginTop:10}}
                                onPress={()=>{

                                    RazorpayCheckout.open(this.state.options).then((data) => {
                                        // handle success
                                       this.bookingInitiated();
                                    }).catch((error) => {
                                        // handle failure
                                        alert(`Error: ${error.code} | ${error.description}`);
                                    });

                                }}>
                            <Text>Pay &#8377;{this.state.advanceAmount} advance and Book</Text>
                        </Button>






                    </CardSection>
                    </ScrollView>
                </View>




                <Dialog
                    visible={this.state.modalVisible}
                    onTouchOutside={() => this.setState({modalVisible: false})} >
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{flex:9,marginTop:5,fontSize:20}}>Other Charges and Taxes</Text>
                            <Icon style={{flex:1,backgroundColor:'transparent'}} name = 'ios-close' onPress = {()=>this.closeModal()}/>
                        </View>
                        <View style={{width:'100%',justifyContent:'center',alignItems:'flex-start',marginTop:10}}>
                            {this.state.response.details.terms.map((term, index) => {
                                return(
                                    <Text style={{margin:2,padding:2}} key={index}>
                                        - {term}
                                    </Text>
                                )
                            })}
                        </View>
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


export default PayScreen;