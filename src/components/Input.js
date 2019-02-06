 import React from 'react';
 import {View,TextInput,Text} from 'react-native';

//  here label is a prop that we are providing in parent class
 const Input = ({label , value , onChangeText , placeholder , secureTextEntry,keyboardType,maxLength}) => {
     const {inputStyle ,containerStyle ,labelStyle } = styles ;
     return (
       <View style = {containerStyle}>
           {/* <Text  style = {labelStyle}>{label} </Text> */}
           <TextInput 
               secureTextEntry = {secureTextEntry}
               placeholder = {placeholder}
               value = {value}
               onChangeText = {onChangeText}
               style = {inputStyle}
               maxLength={maxLength?maxLength:30}
               underlineColorAndroid ='transparent'
               keyboardType = {keyboardType}

           />
         
        </View>

     );
 }

 const styles = {
     inputStyle :{

      color: '#000',
      paddingLeft : 10,
      paddingRight : 5 ,
      fontSize : 16 ,
      flex: 2,
      
     },
     labelStyle : {
         fontSize: 18,
         paddingLeft : 20 ,
         flex: 1


     },
     containerStyle : {
          height: 40,
         flex : 1,
         flexDirection : 'row',
         alignItems : 'center'

     }
 }
 export {Input} ;