import React, { Component } from "react";
import {
    AsyncStorage, FlatList, Image, ImageBackground, Modal, StatusBar, TouchableHighlight, TouchableOpacity,
    View, Platform, Share, Alert
} from "react-native";
import styles from "./detail.style";
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";
import { Dialog } from 'react-native-simple-dialogs';
import {Input} from "../components/Input";
import {CheckCoupon, PlaceBooking, BookingInitiated, UserWalletBalance} from "./Provider";
import {CreateVisitor,SlackCall} from "../home/Provider";
import Toast, {DURATION} from 'react-native-easy-toast';
import RazorpayCheckout from 'react-native-razorpay';
import moment from "moment";
import {ShareDialog, ShareApi} from 'react-native-fbsdk';
import {
    RAZAR_PAY_KEY_LIVE,RAZAR_PAY_KEY_TEST
} from '../constant/Constants';
import {PostEnquiry} from "../thankyou/Provider";
import {CheckBox} from "react-native-elements";
let url="";


class DetailScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            itinerary:this.props.navigation.state.params.itinerary,
            response :this.props.navigation.state.params.response,
            fareChart :this.props.navigation.state.params.fareChart,
            postData: this.props.navigation.state.params.postData,
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
            name:'',
            email:'',
            carType:'',
            balance:'',
            maxCurrentDiscount:'',
        }

    }

    componentWillMount(){

        this._getNumberValue();
        this._getToken();
    }

    async _getNumberValue(){
        const number = await AsyncStorage.getItem('number');
        const name =  await AsyncStorage.getItem('name');
        const email = await AsyncStorage.getItem('email');
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
            this.setState({
                token:token
            });
        }

        //this.getWalletBalance(token);

    }

    getWalletBalance(token,price,fare,amount,amountCb,id) {

        UserWalletBalance(token,price).then((res) => {

            if (res.status === 200) {
                this.setState({
                    loading: false,
                    balance:res.data.balance,
                    maxCurrentDiscount: res.data.maxWalletDiscount,
                });

                let walletDiscount =  res.data.balance> res.data.maxWalletDiscount?res.data.maxWalletDiscount:res.data.balance;

                let cbfare = fare.estimatedCbFare - walletDiscount;
                let cbPrice = fare.estimatedPriceCb - walletDiscount;
                let gst = ((cbPrice * (5 / 100)).toFixed(2));
                amount = Number(cbfare) + Number(gst);



                this.setState({
                    advanceAmount:amount.toFixed(2),
                    paymentDialog:true,
                    amountCb:amountCb,
                    carId:id,
                    carType:fare.carType
                })


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

    renderItem = (place,index) =>{

        return(
            <View key={place.index} style={{flexDirection:'row',alignItems:'center'}} >
                <View style={{backgroundColor:"#e5ae43",borderRadius:10,height:35,justifyContent:'center',alignItems:'center',marginLeft:2.5,marginRight:2.5,padding:2}}>
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

    shareLinkWithShareDialog(shareLinkContent) {

        ShareDialog.canShow(shareLinkContent).then((res)=>{
                console.log("Result in show: ",res)
                if (res) {
                    console.log("this.state.shareLinkContent: ",shareLinkContent)
                    return ShareDialog.show(shareLinkContent);
                }
            }

        ).then(
            function(result) {
                console.log("Result: ",result)
                if (result.postId===null) {
                    console.log("AlalalZxcdccxcxcxzcxz cxz zcxxzcxczcxzcxzcxa","asncadas");

                    this.setState({
                        modalVisible:true
                    });
                    Alert.alert(
                        'Post Shared',
                        '',
                        [
                            {text: 'OK', onPress:this.props.navigation.navigate("Booking") },
                        ],
                        { cancelable: false }
                    )
                    // alert('Share success with postId: ' + result.postId);
                } else {
                    alert('Share cancelled');

                }
            },
            function(error) {
                alert('Share fail with error: ' + error);
            }
        );
    }

    postEnquiry(post){

        if(url==="") {
            PostEnquiry(this.state.postData, this.state.token).then((res) => {


                if (res.status === 200) {
                    this.setState({
                        loading: false,

                    });
                    url = res.data._id;
                    console.log("Url : ",url)
                    if (post === 1) {

                        let shareLinkContent = {
                            contentType: 'link',
                            contentDescription: 'Facebook sharing is easy!',
                            contentUrl: 'https://cabbazar.com/prices.html?enquiry=' + url,
                        };

                        console.log("Share Data: ", shareLinkContent);
                        this.shareLinkWithShareDialog(shareLinkContent);
                    }else{
                        let data ='https://cabbazar.com/prices.html?enquiry=' + url;
                        this.onShare(data)
                    }

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
            console.log("Url in else: ",url)
            if (post === 1) {
                let shareLinkContent = {
                    contentType: 'link',
                    contentDescription: 'Facebook sharing is easy!',
                    contentUrl: 'https://cabbazar.com/prices.html?enquiry=' + url,
                };

                console.log("Share Data: ", shareLinkContent);
                this.shareLinkWithShareDialog(shareLinkContent);
            }else{
                let data ='https://cabbazar.com/prices.html?enquiry=' + url;

                this.onShare(data)
            }
        }

    }

    onShare = async (message) => {
        console.log("Data:8888888**********************************************",message  )
        try {
            const result = await Share.share({
                message:
                    message,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    renderFareItem = (fare) =>{
        let image;
        let price;
        let cars;

        if(fare.item.carType==="suv"){
            image = require('../../assets/suv.png')
            cars = "Innova, Xylo, Ertiga or Similar";
        }else if(fare.item.carType==="innova"){
            image = require('../../assets/suv.png')
            cars = "Assured Innova";
        }else if(fare.item.carType==="sedan"){
            image = require('../../assets/sedan.png')
            cars = "Dzire, Etios or Similar";
        }else if(fare.item.carType==="hatchback"){
            image = require('../../assets/hatchback.png')
            cars = "Indica, Swift or Similar";
        }else {
            image = require('../../assets/traveler.png')
            cars = "Tempo Traveler";
        }
        let percentage = 100 - fare.item.offerPercentage;

        price  = (fare.item.estimatedPriceCb * 100)/percentage;



        return(
            <CardSection key={fare.index} style={styles.cardFare}>


                <Image source={image} style={{height:100,width:250,marginTop:'5%'}}/>

                <ImageBackground source={require('../../assets/offer-badge.png')} style={{height:70,width:70,position:'absolute',top:'5%',left:'7%',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{alignSelf:'center',fontWeight: 'bold',fontSize: 20,color:'white'}}>{fare.item.offerPercentage}%</Text>
                    <Text style={{alignSelf:'center',fontWeight: 'bold',fontSize: 17,color:'white'}}>OFF</Text>
                </ImageBackground>

                <Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid',color:"red",fontSize: 20}}>&#8377;{price.toFixed(0)}</Text>

                <Text style={{color:"#01c501",fontSize: 25,fontWeight: 'bold'}}>&#8377;{fare.item.estimatedPriceCb}</Text>
                <Text style={{color:"#51bcda",fontSize: 15,fontWeight: 'bold'}}>{fare.item.carType.toUpperCase()}(AC)</Text>

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
                            {fare.item.includedKm}Km
                        </Text>

                    </View>
                </View>
                <View style={{width:'90%',marginTop:10}}>
                    <View style={{flexDirection:'row'}}>

                        <Text style={{flex:1}}>
                            Extra Fare/KM
                        </Text>

                        <Text style={{flex:1,textAlign:"right"}}>
                            &#8377;{fare.item.roundTripPricePerKmCb}/km
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

                <TouchableOpacity style={{backgroundColor:'transparent',alignSelf:'center'}} onPress={()=>this.onSelectItem()}>
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




                        <Button style={{backgroundColor:"#e5ae43",padding:4,elevation:3,alignSelf:"center",justifyContent:"center",alignItems:"center",marginTop:10,
                            width:"90%", shadowColor: 'rgba(0,0,0,1)',
                            shadowOffset: {
                                width: .5,
                                height: .5
                            },

                        }} onPress={()=>this.postEnquiry(2)}>
                            <Text style={{color:"white"}}>Share with friends</Text>
                        </Button>


                    {/*<View style={{backgroundColor:'transparent',justifyContent:'center',alignItems:'center',flex:1}}
                           >
                        <TouchableOpacity onPress={()=>this.postEnquiry(2)}>
                            <Image style={{height:50,width:50}}  source={require('../../assets/whatsapp.png')}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{backgroundColor:'transparent',justifyContent:'center',alignItems:'center',flex:1}}
                    >
                        <TouchableOpacity>
                            <Image style={{height:50,width:50}}  source={require('../../assets/gmail.png')}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{backgroundColor:'transparent',justifyContent:'center',alignItems:'center',flex:1}}
                    >
                        <TouchableOpacity>
                            <Image style={{height:50,width:50}}  source={require('../../assets/twitter.png')}/>
                        </TouchableOpacity>
                    </View>*/}



                <Button style={{backgroundColor:'#f5593d',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'90%',marginTop:10}}
                        onPress={()=>{Platform.OS==='ios' ? this.props.navigation.navigate("PayScreen",
                            {
                                postData:this.state.postData,
                                itinerary:this.state.itinerary,
                                response :this.state.response,
                                fareChart :this.state.fareChart,
                                item: fare.item

                            }):this.openPaymentModal(fare.item,fare.item.advanceAmount,fare.item.journeyPriceCb,
                            fare.item._id)}}>
                    <Text>Book Now</Text>
                </Button>


            </CardSection>

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

    openPaymentModal(fare,amount,amountCb,id){
        this.getWalletBalance(this.state.token,fare.estimatedPriceCb,fare,amount,amountCb,id);


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
                journeyPrice: this.state.amountCb
            };
            this.setState({
                loading: true,
            })



            CheckCoupon(data).then((res) => {

                if (res.status === 200) {
                    this.setState({
                        loading: false,
                        couponApplied:res.data.isCouponApplied
                    });
                    if(res.data.isCouponApplied){
                        this.showToast(res.data.message)
                        this.setState({
                            couponMessage:res.data.message,
                            coupon:res.data.couponCode,
                            advanceAmount:this.state.advanceAmount
                        })
                        this.placeBooking(res.data.couponCode)
                    }else{
                        this.showToast(res.data.message)
                    }

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
            alert("Please enter coupon.")
        }

    }

    placeBooking(coupon) {
        let data = {
            isReturn:this.state.response.details.isReturn ,
            itinerary: this.state.itinerary,
            departureAt: this.state.response.details.departureAt,
            arrivalAt:  this.state.response.details.arrivalAt,
            carId: this.state.carId,
            couponCode: coupon,
            dynamicWalletDiscount:true,
        };
        this.setState({
            loading: true,
        });



        PlaceBooking(data,this.state.token).then((res) => {

            console.log("Place Booking: ",res)
            if (res.status === 200) {
                this.setState({
                    loading: false,
                    bookingId:res.data.notes[1]
                });
                this.setState({
                    advanceAmount:res.data.amount/100
                })


                this.creatVisitorLead(res.data);

                this.openRazorPay(res.data)

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

    creatVisitorLead(data) {

        let arrival ="";

        if(this.state.response.details.isReturn){
            arrival = " | Arrival: "+ moment.unix(this.state.response.details.arrivalAt).format("DD-MM-YYYY HH:mm");
        }else{
            arrival ="";
        }
        let address="";
        this.state.itinerary.map((data,index)=>{
            address = address+data.address+" / "
        });
        let slackData='Mobile App | Departure : ' +moment.unix(this.state.response.details.departureAt).format("DD-MM-YYYY HH:mm") + arrival +
            " | Phone: "+ data.phone +" | Itinerary: "+ address + ' | Revenue : ' + this.state.advanceAmount;



        let visitor={
            name: data.name,
            phone: data.phone,
            email: data.email,
            carType:this.state.fareChart.carType,
            departureAt: this.state.response.details.departureAt,
            arrivalAt:  this.state.response.details.arrivalAt,
            isReturn: this.state.response.details.isReturn ,
            itinerary: this.state.itinerary,
            visitorType: 'lead'
        };

        CreateVisitor(visitor).then((res) =>{

        });

        SlackCall(slackData).then((res) =>{

        });

    }


    bookingInitiated() {

        BookingInitiated(this.state.token,this.state.bookingId).then((res) => {

            if (res.status === 200) {
                this.setState({
                    loading: false,

                });

                this.props.navigation.navigate("Thankyou",{postData:this.state.postData});

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

    openRazorPay(data){
        let options = {
            description: 'Advance booking amount payment '+data.bookingId,
            image: 'https://cabbazar.com/assets/img/logo/featured-image.jpg',
            currency: 'INR',
            key: RAZAR_PAY_KEY_LIVE,
            amount:data.amount ,
            name: 'Cab Bazar LLP',
            notes:data.notes,
            prefill: {
                email: data.email,
                contact: data.phone,
                name: data.name
            },
            theme: {color: '#000000'}
        };
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            this.setState({
                paymentDialog:false,
                loading: true,
            })

            this.bookingInitiated();

        }).catch((error) => {
            // handle failure
            alert(`Error: ${error.code} | ${error.description}`);
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
                    <Title style={titleStyle}>Details</Title>
                    </Body>
                    <Right/>
                </Header>

                <View style={styles.containerHeader}>

                    <FlatList
                        horizontal={true}
                        data={this.state.itinerary}
                        renderItem={this.renderItem}
                        keyExtractor={ (item, index) => index.toString()}
                    />
                </View>


                <CardSection style={styles.cardStyle}>

                    <View style={{width:'95%'}}>
                        <View style={{flexDirection:'row'}}>

                            <Text style={{flex:1}}>
                                Pickup Date / Time:
                            </Text>

                            <Text style={{flex:1,textAlign:"right",fontWeight:'bold'}}>
                                {moment.unix(this.state.response.details.departureAt).format("DD-MM-YYYY HH:mm")}
                            </Text>

                        </View>
                    </View>

                    {this.state.response.details.isReturn?
                        <View style={{width:'95%',marginTop:10}}>
                            <View style={{flexDirection:'row'}}>

                                <Text style={{flex:1}}>
                                    Return Date:
                                </Text>

                                <Text style={{flex:1,textAlign:"right",fontWeight:'bold'}}>
                                    {moment.unix(this.state.response.details.arrivalAt).format("DD-MM-YYYY HH:mm")}
                                </Text>

                            </View>
                        </View>
                        : null}


                    <View style={{width:'95%',marginTop:10}}>
                        <View style={{flexDirection:'row'}}>

                            <Text style={{flex:1}}>
                                Journey Type:
                            </Text>

                            <Text style={{flex:1,textAlign:"right",fontWeight:'bold'}}>
                                {this.state.response.details.isReturn?"Round Way":"One Way"}
                            </Text>

                        </View>
                    </View>

                </CardSection>


                <View style={styles.containerContent}>
                    <FlatList
                        data={this.state.fareChart}
                        renderItem={this.renderFareItem}
                        keyExtractor={ (item, index) => index.toString()}
                    />
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

                <Dialog
                    visible={this.state.paymentDialog}
                    onTouchOutside={() => this.setState({paymentDialog: false})} >
                    <View>
                        <Loader loading={this.state.loading} />
                        <View style={{flexDirection:'row'}}>
                            <Text style={{flex:9,marginTop:5,fontSize:20}}>Pay and Place Booking</Text>
                            <Icon style={{flex:1,backgroundColor:'transparent'}} name = 'ios-close' onPress = {()=>this.closeModal()}/>
                        </View>

                        <View style={styles.checkBoxStyle}>

                            <CheckBox
                                iconRight
                                center
                                disabled
                                checkedColor='blue'
                                checked={true}
                                size = {24}
                                containerStyle={{ marginLeft: 0, marginRight: 0, borderWidth: 0 ,backgroundColor:'transparent'}}/>

                            <Text style={{color:'black',paddingLeft:5}}>Rewards Discount - {this.state.balance> this.state.maxCurrentDiscount?this.state.maxCurrentDiscount:this.state.balance}</Text>

                        </View>

                        {!this.state.couponApplied?<View style={{flexDirection:'row',paddingTop:5}}>

                                <View style={styles.SectionStyle}>
                                    <Input
                                        keyboardType = 'default'
                                        placeholder = 'Coupon'
                                        value = {this.state.coupon}
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
                                onPress={()=>this.placeBooking(null)}>
                            <Text>Pay &#8377;{this.state.advanceAmount} advance and Book</Text>
                        </Button>


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


export default DetailScreen;