import React, { Component } from "react";
import {Alert, AsyncStorage, Image, Text, View} from "react-native";
import styles from "./thank.style";
import RazorpayCheckout from "react-native-razorpay";
import {Button} from "native-base";

import {ShareDialog, ShareApi} from 'react-native-fbsdk';
import type {SharePhoto} from "react-native-fbsdk/js/models/FBSharePhoto";
import logo from "../../assets/cab-logo-final2.png";
import {PostEnquiry} from "./Provider";
import Loader from "../components/Loader";
import {Dialog} from "react-native-simple-dialogs";

let url="";
class Thankyou extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token:'',
            postData:this.props.navigation.state.params.postData,
            urlId:"",
            loading:false,
            modalVisible:false


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

                console.log("Post Booking: ", res)
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

            }
        }

    }


    render(){
        return(
            <View style={styles.containerContent}>
                <Loader loading={this.state.loading} />
                <Text style={styles.text1}>Booking placed <Text style={{color:"#6bd098"}}>Successfully</Text></Text>

                <Image style={styles.ImageStyle} source={require('../../assets/checked.png')}/>


                <Text style={styles.text}>Thank you for choosing <Text style={{color:"#e5ae43"}}>Cab</Text>Bazar. You will soon receive confirmation through SMS and email.</Text>


                <Button style={{backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'80%',marginTop:10}}
                        onPress={()=>{this.postEnquiry(1)}}>
                    <Text style={{color:"white",fontWeight:"bold",fontSize:15}}>Share on facebook</Text>
                </Button>

                <Dialog
                    visible={this.state.modalVisible}>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{flex:9,marginTop:5,fontSize:20}}>Post Shared</Text>
                        </View>
                        <View style={{width:'100%',justifyContent:'center',alignItems:'flex-start',marginTop:10}}>

                        </View>
                        <Button style={{backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'80%',marginTop:10}}
                                onPress={()=>{this.props.navigation.navigate("Booking")}}>
                            <Text style={{color:"white",fontWeight:"bold",fontSize:15}}>Close</Text>
                        </Button>
                    </View>
                </Dialog>


            </View>
        )
    }

}





export default Thankyou;
