import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    StatusBar, TextInput, TouchableOpacity, ScrollView, AsyncStorage,
    BackHandler
} from "react-native";
import {Header, Left, Right, Icon, Body, Title, Item, Input, Content} from "native-base";
import styles from './home.style';
import AppTheme from '../components/AppTheme.style';
import Loader from '../components/Loader';
import DatePicker from "react-native-datepicker";
import {GoogleAutoComplete} from 'react-native-google-autocomplete';
import Button from '../components/Button'
import moment from "moment";
import {CreateVisitor, GetPrices,SlackCall} from "./Provider";
import Toast, {DURATION} from 'react-native-easy-toast';
import LocationItem from '../components/LocationItem';
import firebase, {Notification, NotificationOpen} from "react-native-firebase";
import RNGooglePlaces from 'react-native-google-places';


let d1 = new Date();
d1.setHours((new Date().getHours())+2);




class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pickDate:d1,
            returnDate:"",
            mobile:'',
            oneWay:false,
            isLocationListShow: true,
            itineraryRoundWay:[],
            itineraryOneWay:[],
            addLocation:false
        };
    }
    componentWillMount(){

        this._getNumberValue();
        BackHandler.addEventListener('hardwareBackPress', HomeScreen.handleBackButtonClick);
        //  this.locationData();


    }
    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
// Create the channel
        firebase.notifications().android.createChannel(channel);
        this.notificationListener = firebase.notifications().onNotification((notification) => {

            const { title, body } = notification;
            notification
                .android.setChannelId('test-channel')
                .android.setSmallIcon('ic_launcher');
            firebase.notifications()
                .displayNotification(notification);



        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.props.navigation.navigate("Booking")
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;


        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message

        });
    }


    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        this.messageListener();
        BackHandler.removeEventListener('hardwareBackPress', HomeScreen.handleBackButtonClick);
    }

    static handleBackButtonClick() {
        BackHandler.exitApp()
    }

    openSearchModal(trip) {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {

                let loc ={
                    address: place.name,
                    location: {
                        lat: place.latitude,
                        lng: place.longitude
                    }
                }

                if(trip===1) {
                    this.state.itineraryOneWay.push(loc);
                    this.setState({
                        itineraryOneWay: this.state.itineraryOneWay,
                        addLocation: !this.state.addLocation
                    });
                }else{
                    this.state.itineraryRoundWay.push(loc);
                    this.setState({
                        itineraryRoundWay: this.state.itineraryRoundWay,
                        addLocation: !this.state.addLocation
                    });
                }


            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }



    async checkPermission() {

        const enabled = await firebase.messaging().hasPermission();

        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {

        let fcmToken = await AsyncStorage.getItem('fcmToken');

        if (fcmToken==null) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token

                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised

            this.getToken();
        } catch (error) {
            console.log("Token: ",error)
            // User has rejected permissions

        }
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




    sendData() {


        let data ={};
        if(this.state.oneWay){
            data={
                isReturn:!this.state.oneWay,
                itinerary: this.state.itineraryOneWay,
                departureAt: (moment(this.state.pickDate.toString()).unix()),
                arrivalAt: null,
                phone: this.state.mobile,
                visitorType:'visitor'
            };

            this.getPrices(data);
            this.createVisitor(data)
        }else{
            if(this.state.returnDate!=='') {

                data = {
                    isReturn: !this.state.oneWay,
                    itinerary: this.state.itineraryRoundWay,
                    departureAt: (moment(this.state.pickDate.toString()).unix()),
                    arrivalAt: (moment(this.state.returnDate.toString()).unix() + 86399),
                    phone: this.state.mobile,
                    visitorType:'visitor'
                };

                this.getPrices(data);
                this.createVisitor(data)
            }else{

                alert("Please enter return date")
            }
        }
    }

    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }

    createVisitor(data) {
        let arrival ="";

        if(data.isReturn){
            arrival = " | Arrival: "+ moment.unix(data.arrivalAt).format("DD-MM-YYYY HH:mm");
        }else{
            arrival ="";
        }
        let address="";
        data.itinerary.map((data,index)=>{
            address = address+data.address+" / "
        });
        let slackData='Mobile App | Departure : ' +moment.unix(data.departureAt).format("DD-MM-YYYY HH:mm") + arrival + " | Phone: "+ data.phone +" | Itinerary: "+
            address;

        CreateVisitor(data).then((res) =>{

        });

        SlackCall(slackData).then((res) =>{

        });


    }


    getPrices(data){

        this.setState({
            loading:true
        });



        GetPrices(data).then((res) =>{

            if (res.status===200) {
                this.setState({
                    loading: false,
                })
                console.log("Rewsponse in getPrice: ",res)
                this.props.navigation.navigate("DetailScreen",{itinerary:res.data.details.itinerary,response:res.data,fareChart:res.data.fareChart})
            }else {
                this.showToast(res.data.message)
                this.setState({
                    loading: false,
                })
            }

        });
    }


    renderItem = (place,index) =>{


        return(
            <View key={place.index}>
                <View style={{backgroundColor:"rgb(204,162,80)",borderRadius:10,justifyContent:'center',alignItems:'center',
                    marginLeft:2.5,marginRight:2.5,padding:5,margin:5,flexDirection:'row'}}>
                    <Text style={styles.listText}>
                        {place.item.address}
                    </Text>

                    <Icon style={{backgroundColor:'transparent',flex:1}} name = 'ios-close' onPress = {()=>this.removeItem(place.item)}/>
                </View>
                {place.index<this.state.itineraryOneWay.length-1||place.index<this.state.itineraryRoundWay.length-1
                    ? <Icon style={{padding:0,width:20,height:20,alignSelf:'center'}} name = 'ios-arrow-down'/>

                    :null
                }
            </View>
        )
    };

    removeItem(data){

        this.state.itineraryOneWay.pop(data);
        this.state.itineraryRoundWay.pop(data);
        this.setState({
            itineraryOneWay:this.state.itineraryOneWay,
            itineraryRoundWay:this.state.itineraryRoundWay,
        });
    }


    render() {


        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;

        return (
            <View  style = {styles.container}>

                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}   >
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-menu' onPress = {()=>this.props.navigation.openDrawer()}/>
                    </Left>
                    <Left/>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                    <Title style={titleStyle}>Home</Title></Body>
                    <Right style={{justifyContent: 'flex-end'}}>

                    </Right>
                    <Right>

                    </Right>
                </Header>
                <View style={{flex:.7,backgroundColor:'white',elevation:3,shadowOffset:{  width: 1,  height: 1 },
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowOpacity: 1.0}} >
                    <View style={{flexDirection:'row',flex:1}}>
                        <TouchableOpacity style={{width:"50%",height:'100%',justifyContent:'center',alignItems:'center',borderRightWidth:1,borderColor:"gray"}}
                                          onPress={()=>this.setState({oneWay:false})}>
                            <View style={{width:"100%",height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:!this.state.oneWay?"#d3d3d3":'white'}}>
                                <Text>Round Trip</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:"50%",height:'100%',justifyContent:'center',alignItems:'center'}}
                                          onPress={()=>this.setState({oneWay:true})}>
                            <View style={{width:"100%",height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:this.state.oneWay?"#d3d3d3":'white'}}>
                                <Text>One Way Trip</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{height:10,backgroundColor:'white',marginBottom:2}}>
                    <View style={{flexDirection:'row',flex:1}}>
                        <View style={{width:"50%",height:'100%',justifyContent:'center',alignItems:'center',borderColor:"gray",borderRightWidth:1, backgroundColor:!this.state.oneWay?'rgb(204,162,80)':'white'}}>
                        </View>
                        <View style={{width:"50%",height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:!this.state.oneWay?'white':'rgb(204,162,80)'}}>
                        </View>
                    </View>
                </View>


                {this.state.oneWay?
                    <View style={styles.containerScroll}>
                        <ScrollView style={{flex:1}}>
                            <View style={styles.containerContent}>
                                <Text style={styles.text}>Pickup Date and Time:</Text>
                                <View style={styles.SectionStyle}>
                                    <Icon style={styles.searchIcon} name="ios-calendar" size={20} color="#000"/>
                                    <DatePicker
                                        style={{flex:1}}
                                        date={this.state.pickDate}
                                        mode="datetime"
                                        placeholder="Pickup Date and time"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={d1}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                marginRight:10,
                                                marginLeft:10,
                                                marginTop:5,
                                                marginBottom:5,
                                                borderColor: 'transparent',
                                                borderWidth: 1,

                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({pickDate: date})}}
                                    />
                                </View>

                                {this.state.itineraryOneWay.length===1||this.state.itineraryOneWay.length>=1?
                                    null
                                    :<View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Pickup Location:</Text>
                                        <View style={styles.SectionStyle}>
                                            <Icon style={styles.searchIcon} name="ios-pin" size={20} color="#000"/>
                                            <TouchableOpacity
                                                style={styles.inputPlace}
                                                onPress={() => this.openSearchModal(1)}
                                            >
                                                <Text>Pickup Location</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}

                                {this.state.itineraryOneWay.length===2?
                                    null: <View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Destination:</Text>
                                        <View style={styles.SectionStyle}>
                                            <Icon style={styles.searchIcon} name="ios-pin" size={20} color="#000"/>
                                            <TouchableOpacity
                                                style={styles.inputPlace}
                                                onPress={() => this.openSearchModal(1)}
                                            >
                                                <Text style={{color:"#d3d3d3"}}>Destination</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }

                                {this.state.itineraryOneWay.length>0?
                                    <View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Your Itinerary:</Text>
                                        <View style={styles.SectionListStyle}>
                                            <FlatList
                                                extraData={this.state}
                                                data={this.state.itineraryOneWay}
                                                renderItem={this.renderItem}
                                                keyExtractor={ (item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                                    :
                                    null}

                                <View style={styles.SectionStyle}>
                                    <Button onPress={()=>this.sendData()} children={"Get Prices"}>
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={styles.containerScroll}>
                        <ScrollView style={{flex:1}}>
                            <View style={styles.containerContent}>

                                <Text style={styles.text}>Pickup Date and Time:</Text>
                                <View style={styles.SectionStyle}>
                                    <Icon style={styles.searchIcon} name="ios-calendar" size={20} color="#000"/>
                                    <DatePicker
                                        style={{flex:1}}
                                        date={this.state.pickDate}
                                        mode="datetime"
                                        placeholder="Pickup Date and time"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={d1}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                marginRight:10,
                                                marginLeft:10,
                                                marginTop:5,
                                                marginBottom:5,
                                                borderColor: 'transparent',
                                                borderWidth: 1,

                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({pickDate: date})}}
                                    />
                                </View>
                                <Text style={styles.text}>Pickup Date and Time:</Text>
                                <View style={styles.SectionStyle}>
                                    <Icon style={styles.searchIcon} name="ios-time" size={20} color="#000"/>
                                    <DatePicker
                                        style={{flex:1}}
                                        date={this.state.returnDate}
                                        mode="date"
                                        placeholder="Return Date"
                                        format="YYYY-MM-DD"
                                        minDate={d1}
                                        showIcon={false}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateInput: {
                                                marginRight:10,
                                                marginLeft:10,
                                                marginTop:5,
                                                marginBottom:5,
                                                borderColor: 'transparent',
                                                borderWidth: 1,

                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {this.setState({returnDate: date})}}
                                    />
                                </View>

                                {this.state.itineraryRoundWay.length===1||this.state.itineraryRoundWay.length>=1?
                                    null

                                    :<View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Pickup Location:</Text>
                                        <View style={styles.SectionStyle}>
                                            <Icon style={styles.searchIcon} name="ios-pin" size={20} color="#000"/>
                                            <TouchableOpacity
                                                style={styles.inputPlace}
                                                onPress={() => this.openSearchModal(2)}
                                            >
                                                <Text style={{color:"#d3d3d3"}}>Pickup Location</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}

                                {this.state.itineraryRoundWay.length>=2?
                                    null:
                                    <View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Destination:</Text>
                                        <View style={styles.SectionStyle}>
                                            <Icon style={styles.searchIcon} name="ios-pin" size={20} color="#000"/>
                                            <TouchableOpacity
                                                style={styles.inputPlace}
                                                onPress={() => this.openSearchModal(2)}
                                            >
                                                <Text style={{color:"#d3d3d3"}}>Destination</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }

                                {this.state.itineraryRoundWay.length>0?
                                    <View>
                                        <Text style={[styles.text,{marginLeft:5}]}>Your Itinerary:</Text>
                                        <View style={styles.SectionListStyle}>
                                            <FlatList
                                                extraData={this.state}
                                                data={this.state.itineraryRoundWay}
                                                renderItem={this.renderItem}
                                                keyExtractor={ (item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                                    :
                                    null}

                                {this.state.itineraryRoundWay.length>=2?
                                    <View style={styles.SectionStyle}>
                                        <Icon style={styles.searchIcon} name="ios-pin" size={20} color="#000"/>
                                        <TouchableOpacity
                                            style={styles.inputPlace}
                                            onPress={() => this.openSearchModal(2)}
                                        >
                                            <Text>+ Add more</Text>
                                        </TouchableOpacity>
                                    </View>:null
                                }

                                <View style={styles.SectionStyle}>
                                    <Button  children={"Get Prices"} onPress={()=>this.sendData()}>
                                    </Button>
                                </View>



                            </View>
                        </ScrollView>
                    </View>}

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
        );
    }


}
export default HomeScreen;

