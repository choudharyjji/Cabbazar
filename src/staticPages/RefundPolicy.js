import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar, TextInput, TouchableOpacity
} from "react-native";
import {Header, Left, Right, Icon, Body, Title, Item, Input, Button, Content} from "native-base";
import styles from '../staticPages/static.style';
import Loader from '../components/Loader';
import {CustomHeader} from '../components/CustomHeader'
import {WebviewComponent} from '../components/WebviewComponent';

class RefundPolicy extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            pickDate:new Date(),
            returnDate:"",
            mobile:'',
            oneWay:false,
        };
    }

    render() {

        return (
            <View  style = {styles.container}>
                <StatusBar hidden />
                <Loader loading={this.state.loading} />
                <CustomHeader headerText={"Refund Policy"} navigation={this.props.navigation}/>
                <View style={styles.containerContent}>
                    <WebviewComponent uri={'https://cabbazar.com/route/refund-policy.html'}/>
                </View>
            </View>
        );
    }
}
export default RefundPolicy;

