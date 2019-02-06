import React from 'react';

import {Body, Header, Icon, Left, Right, Title} from "native-base";
import AppTheme from "./AppTheme.style";


const CustomHeader = (props) => {

    const {headerStyle,leftIconStyle,leftStyle,bodyStyle,titleStyle,rightIconStyle} = AppTheme;

    return (
        <Header style = {headerStyle}  >
            <Left style = {leftStyle}>
                <Icon style={leftIconStyle} name = 'ios-menu' onPress = {()=>props.navigation.openDrawer()}/>
            </Left>
            <Left/>
            <Body style = {{flex:3 , justifyContent : 'center'}}>
            <Title style={titleStyle}>{props.headerText}</Title></Body>
            <Right style={{justifyContent: 'flex-end'}}>

            </Right>
            <Right>

            </Right>
        </Header>
    );
};

export  {CustomHeader};