import  React from 'react';
import {View,Text, TouchableOpacity} from 'react-native';

const LocationItem = (props) => {

    
    
return (
            <TouchableOpacity style = {styles.viewStyle} onPress={console.log('pressed')}>
                <Text>
                {props.name}
                </Text>
                
            </TouchableOpacity>
      );
};


const styles ={
 viewStyle:{
     backgroundColor: 'white',
     height:100,
     borderBottomWidth: 1,
    justifyContent: 'center',
    padding:5,

 }
}

export default LocationItem ;
