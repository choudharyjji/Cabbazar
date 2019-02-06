import React from 'react';
import {WebView} from "react-native";
import {Dimensions} from "react-native";

const { height, width } = Dimensions.get('window');
const deviceHeight = height;
let deviceWidth = width;


const WebviewComponent = (props) => {



    return (
        <WebView
            automaticallyAdjustContentInsets={false}
            source={{uri: props.uri}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={{backgroundColor:'black',width:deviceWidth}}
            startInLoadingState={true}
        />
    );
};

export {WebviewComponent};