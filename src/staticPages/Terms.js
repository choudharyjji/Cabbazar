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

import {WebviewComponent} from '../components/WebviewComponent';
import {CustomHeader} from '../components/CustomHeader'

class Terms extends Component {

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
                <CustomHeader headerText={"Terms And Condition"} navigation={this.props.navigation}/>
                <View style={styles.containerContent}>
                    <WebviewComponent uri={'https://cabbazar.com/route/terms-of-use.html'}/>
                </View>
            </View>
        );
    }
}
export default Terms;

