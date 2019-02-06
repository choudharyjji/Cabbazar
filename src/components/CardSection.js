import  React from 'react';
import {View,} from 'react-native';

const CardSection = (props) => {
return (
<View style = {props.style}>
    {props.children}
</View>
);
};



export {CardSection}  ;
