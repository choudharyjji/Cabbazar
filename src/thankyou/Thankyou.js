import React, { Component } from "react";
import {Alert, AsyncStorage, Image, Share, Text, View} from "react-native";
import styles from "./thank.style";
import RazorpayCheckout from "react-native-razorpay";
import {Button} from "native-base";

import {ShareDialog, ShareApi} from 'react-native-fbsdk';
import type {SharePhoto} from "react-native-fbsdk/js/models/FBSharePhoto";
import logo from "../../assets/cab-logo-final2.png";
import {PostEnquiry} from "./Provider";
import Loader from "../components/Loader";
import {Dialog} from "react-native-simple-dialogs";
import moment from "moment";

let url="";
class Thankyou extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token:'',
            postData:this.props.navigation.state.params.postData,
            urlId:"",
            loading:false,
            modalVisible:false,



        }
    }

    componentWillMount() {
        this._getToken();

    }

    async _getToken(){
        const token = await AsyncStorage.getItem('token')

        if(token == null){

        }else{
            this.setState({
                token:token
            });
        }


    }



    postEnquiry(post){
        console.log("Post Data : ",this.state.postData)

        // arrivalAt: null
        // departureAt: 1557564420
        // isReturn: false
        // itinerary: Array(2)
        // 0: {address: "Delhi, India", location: {…}}
        // 1: {address: "Chandigarh, India", location: {…}}
        // length: 2
        // __proto__: Array(0)
        // phone: "8059936476"
        // visitorType: "visitor"

        let arrival ="";

        if(this.state.postData.isReturn){
            arrival = " | Arrival: "+ moment.unix(this.state.postData.arrivalAt).format("DD-MM-YYYY HH:mm");
        }else{
            arrival ="";
        }
        let address="";
        this.state.postData.itinerary.map((data,index)=>{
            address = data.address
        });
        let slackData='Going to : '+ address+ " \n with Cabbazar \n" + "https://cabbazar.com"
            ;

        this.onShare(slackData)
    }

    onShare = async (message) => {
        console.log("Data:8888888**********************************************",message  )
        try {
            const result = await Share.share({
                message: message,
            });

            if (result.action === Share.sharedAction) {

                if (result.activityType) {

                    // shared with activity type of result.activityType
                } else {
                    this.props.navigation.navigate("Booking");
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    render(){
        return(
            <View style={styles.containerContent}>
                <Loader loading={this.state.loading} />
                <Text style={styles.text1}>Booking placed <Text style={{color:"#6bd098"}}>Successfully</Text></Text>

                <Image style={styles.ImageStyle} source={require('../../assets/checked.png')}/>


                <Text style={styles.text}>Thank you for choosing <Text style={{color:"#e5ae43"}}>Cab</Text>Bazar. You will soon receive confirmation through SMS and email.</Text>


                <Button style={{backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'80%',marginTop:10}}
                        onPress={()=>{this.postEnquiry(1)}}>
                    <Text style={{color:"white",fontWeight:"bold",fontSize:15}}>Share with friends</Text>
                </Button>




            </View>
        )
    }

}





export default Thankyou;
