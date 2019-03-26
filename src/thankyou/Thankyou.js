import React, { Component } from "react";
import {Image, Text, View} from "react-native";
import styles from "./thank.style";
import RazorpayCheckout from "react-native-razorpay";
import {Button} from "native-base";
import {ShareDialog, ShareApi} from 'react-native-fbsdk';
import type {SharePhoto} from "react-native-fbsdk/js/models/FBSharePhoto";
import logo from "../../assets/cab-logo-final2.png";


class Thankyou extends Component {

    constructor(props) {
        super(props);
        const photoUri = 'file://';
        this.state = {

            shareLinkContent: {
                imageUrl: "https://cabbazar.com/assets/img/logo/featured-image.jpg",
                userGenerated: false,
                caption: "Traveling from her to there with"+ "https://cabbazar.com",
                contentType: 'photo',
                //contentTitle: "Journey with CabBazar",
                contentUrl: 'https://www.cabbazar.com/',
                photos: [{
                    imageUrl: photoUri,

                }],
                //contentDescription: 'Facebook sharing is easy!'
            },

        }
    }

    componentWillMount() {


    }

    shareLinkWithShareDialog() {
        /*ShareApi.canShare(this.state.shareLinkContent).then(
            function(canShare) {
                if (canShare) {
                    return ShareApi.share(this.state.shareLinkContent, '/me', 'Some message.');
                }
            }
        ).then(
            function(result) {
                console.log("Result : ",result)
                alert('Share operation with ShareApi was successful');
            },
            function(error) {
                alert('Share with ShareApi failed with error: ' + error);
            }
        );*/
        ShareDialog.canShow(this.state.shareLinkContent).then((res)=>{
                console.log("Result: ",res)
                if (res) {
                    console.log("this.state.shareLinkContent: ",this.state.shareLinkContent)
                    return ShareDialog.show(this.state.shareLinkContent);
                }
            }
            /*function(canShow) {
                console.log("",canShow)
                if (canShow) {
                    return ShareDialog.show(this.state.shareLinkContent);
                }
            }*/
        ).then(
            function(result) {
                console.log("Result: ",result)
                if (result.isCancelled) {
                    alert('Share cancelled');
                } else {
                    alert('Share success with postId: ' + result.postId);
                }
            },
            function(error) {
                alert('Share fail with error: ' + error);
            }
        );
    }


    render(){
        return(
            <View style={styles.containerContent}>

                <Text style={styles.text1}>Booking placed <Text style={{color:"#6bd098"}}>Successfully</Text></Text>

                <Image style={styles.ImageStyle} source={require('../../assets/checked.png')}></Image>


                <Text style={styles.text}>Thank you for choosing <Text style={{color:"#e5ae43"}}>Cab</Text>Bazar. You will soon receive confirmation through SMS and email.</Text>


                <Button style={{backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'80%',marginTop:10}}
                        onPress={()=>{this.shareLinkWithShareDialog()}}>
                    <Text style={{color:"white",fontWeight:"bold",fontSize:15}}>Share on facebook</Text>
                </Button>
            </View>
        )
    }

}





export default Thankyou;
