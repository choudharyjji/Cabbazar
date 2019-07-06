import React, { Component } from "react";
import {
    Alert,
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    Platform,
    ScrollView,
    Share,
    StatusBar,
    TouchableOpacity,
    View
} from "react-native";
import styles from './wallet.style'
import Loader from "../components/Loader";
import {Body, Button, Header, Icon, Left, Right, Text, Title} from "native-base";
import AppTheme from '../components/AppTheme.style';
import {CardSection} from "../components/CardSection";
import Toast, {DURATION} from 'react-native-easy-toast';
import {GetProfile} from "../profile/Provider";
import {UserWallet,ShareApp} from "./Provider";
import {ShareDialog, ShareApi} from 'react-native-fbsdk';





class Wallet extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            mobile:'',
            token:'',
            balance:'',
            transactions:'',
            message:'',
            shareLinkContent : {
                contentType: 'link',
                contentDescription: 'Facebook sharing is easy!',
                contentUrl: 'https://cabbazar.com',
            },
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
        console.log('LoginToken',token);
        if(token == null){

        }else{
            this.setState({
                token:token

            });
        }


        this.getUserWallet(token);

    }


    getUserWallet(token) {

        this.setState({
            loading:true,
        });

        UserWallet(token).then((res) => {

            if (res.status === 200) {
                console.log("Response wallet : ",res.data)
                this.setState({
                    loading: false,
                    balance:res.data.balance,
                    transactions:res.data.walletTxns,

                });


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

    shareLinkWithShareDialog(token) {

        ShareDialog.canShow(this.state.shareLinkContent).then((res)=>{
                console.log("Result in show: ",res)
                if (res) {
                    console.log("this.state.shareLinkContent: ",this.state.shareLinkContent)
                    return ShareDialog.show(this.state.shareLinkContent);
                }
            }

        ).then((result)=>{
                console.log("Result...................................................................: ",result)
                if (result.postId===null) {
                    console.log("AlalalZxcdccxcxcxzcxz cxz zcxxzcxczcxzcxzcxa","asncadas");
                    if(Platform.OS==='ios'){

                    }else{
                        this.shareApp();
                    }
                    //alert('Share cancelled');
                    //this.shareApp();
                    // alert('Share success with postId: ' + result.postId);
                } else {
                    console.log("AlalalZxcdccxcxcxzcxz cxz zcxxzcxczcxzcxzcxa",token);

                   this.shareApp();


                }
            },
            function(error) {
                alert('Share fail with error: ' + error);
            }
        );
    }

    shareApp(){
        console.log(this.state.token)
        ShareApp(this.state.token).then((res) => {

            if (res.status === 200) {

                this.getUserWallet(this.state.token)
            } else {
                this.showToast(res.data.message)

            }

        }).catch((response) => {

            this.showToast("No Internet")

        });
    }


    showToast(message){
        this.refs.toast.show(message, 500, () => {

        });
    }



    onShare = async () => {
        let url = Platform.OS==='ios'?"https://itunes.apple.com/us/app/cabbazar-outstation-taxi/id1454370854?mt=8"
            :"https://play.google.com/store/apps/details?id=com.cabbazar_user&hl=en";
        try {
            const result = await Share.share({
                message:
                    'CabBazar Car Rentals is India\'s largest cab service provider and is present across various cities in India.' +
                    '\n'+url,
            });

            if (result.action === Share.sharedAction) {

                if (result.activityType) {

                    // shared with activity type of result.activityType
                } else {
                    this.shareApp();
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
        const {profile} = this.state;
        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;
        console.log(this.state.transactions)
        return(
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <Header style = {headerStyle}>
                    <Left style = {leftStyle}>
                        <Icon style={leftIconStyle} name = 'ios-arrow-back' onPress = {()=>this.props.navigation.navigate("HomeScreen")}/>
                    </Left>
                    <Body style = {{flex:3 , justifyContent : 'center'}}>
                        <Title style={titleStyle}>Share and Earn</Title>
                    </Body>
                    <Right/>
                </Header>

                <ScrollView style={{marginBottom:30}}>
                    <View style={styles.containerContent}>
                        <View style={styles.containerInnerContent}>
                            <CardSection style={styles.cardStyle}>
                                <View >
                                    <Text style={{fontSize:100,color:'#e5ae43',fontWeight: 'bold',shadowColor: 'rgba(69,45,45,1)',
                                        shadowOffset: {
                                            width: 0,
                                            height:2
                                        },
                                        shadowOpacity: 0.3,}}>{this.state.balance}</Text>
                                    <Text style={{fontSize:15,  textAlign: "center"}}>Rewards</Text>
                                </View>
                            </CardSection>
                            <CardSection style={styles.cardFare}>

                                <Text style={{fontSize:22,  textAlign: "center"}}>Refer now and earn up to Rs 200 </Text>
                                <Text style={{fontSize:8,  textAlign: "center"}}>* Share rewards will be credited once per week</Text>
                                <Image source={require('../../assets/share.png')} style={{height:100,width:100,marginTop:'5%'}}/>


                                <Button style={{backgroundColor:'#e5ae43',justifyContent:'center',alignItems:'center',alignSelf:'center',width:'80%',
                                    marginTop:20,marginBottom:20}}
                                        onPress={()=>{this.shareLinkWithShareDialog(this.state.token)}}>
                                    <Text style={{color:"white",fontWeight:"bold",fontSize:15}}>Share and Earn</Text>
                                </Button>


                            </CardSection>

                        </View>

                    </View>
                </ScrollView>


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


export default Wallet;