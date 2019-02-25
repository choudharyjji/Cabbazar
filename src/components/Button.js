import  React from 'react';
import {Text , TouchableOpacity} from 'react-native';

const Button = ({onPress, children}) => {
const {buttonStyle , textStyle } = styles ;
    return (
        // here we are clicking on button and calling a function which is declared in parent class 'AlbumDetail' using Props
        <TouchableOpacity   onPress = {onPress}   style = {buttonStyle}>
        {/* here we are using childre to set title of button using ComponentProps from parent class */}
             <Text style = {textStyle}>{children}
              </Text>
          
       </TouchableOpacity>
    );
};

const styles = {
    textStyle : {
   color : 'white',
   fontSize: 16,

   

    },
    buttonStyle : {
        height:'100%',
        width:"100%",
        borderWidth : 0,
        backgroundColor: '#e5ae43',
        borderRadius : 5,
        justifyContent:"center",
        alignItems:"center"
        

    }
}

export default Button;
