import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar, TextInput, TouchableOpacity, WebView, NetInfo
} from "react-native";
import {Header, Left, Right, Icon, Body, Title, Item, Input, Button, Content} from "native-base";
import styles from '../staticPages/static.style';
import AppTheme from '../components/AppTheme.style';
import Loader from '../components/Loader';
import {CustomHeader} from '../components/CustomHeader';
import {WebviewComponent} from '../components/WebviewComponent';




class PrivacyPolicy extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            pickDate:new Date(),
            returnDate:"",
            mobile:'',
            oneWay:false,
            isConnected:false
        };
    }

    componentDidMount(){
        NetInfo.isConnected.fetch().done((isConnected)=>{console.log("NetIs Connected: ",isConnected); this.setState({isConnected:isConnected})})

    }

    render() {

        const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;

        return (
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <CustomHeader headerText={"Privacy Policy"} navigation={this.props.navigation}/>
                <View style={styles.containerContent}>
                    <WebviewComponent uri={'https://cabbazar.com/route/privacy-policy.html'}/>
                </View>
            </View>
        );
    }
}
export default PrivacyPolicy;

