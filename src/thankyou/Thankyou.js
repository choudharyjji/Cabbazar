import React, { Component } from "react";
import {Image, Text, View} from "react-native";
import styles from "./thank.style";
import RazorpayCheckout from "react-native-razorpay";
import {Button} from "native-base";
import {ShareDialog} from 'react-native-fbsdk';


class Thankyou extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shareLinkContent: {
                contentType: 'link',
                contentUrl: 'https://www.facebook.com/',
                contentDescription: 'Facebook sharing is easy!'
            },

        }
    }

    componentWillMount() {


    }

    shareLinkWithShareDialog() {
        console.log("Share Content",this.state.shareLinkContent);
        ShareDialog.canShow(this.state.shareLinkContent).then(
            function(canShow) {
                if (canShow) {
                    return ShareDialog.show(this.state.shareLinkContent);
                }
            }
        ).then(
            function(result) {
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
