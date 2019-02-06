import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions,StackActions} from 'react-navigation';
import {ScrollView, Text, View,Image,TouchableOpacity, Alert,AsyncStorage} from 'react-native';
import styles from './sidemenu.style'
import {Icon} from "native-base";

class SideMenu extends Component {
    navigateToScreen = (route) => () => {
        console.log('route',route)
        const navigateAction = NavigationActions.navigate({
            routeName: route,
        });
        this.props.navigation.navigate(route);
    };

    constructor(props){
        super(props);
        this.state={
            name:'Person name',
            email:''
        }

    }

    componentWillMount(){

        this._getNumberValue();



    }

    async _getNumberValue(){
        const name = await AsyncStorage.getItem('name')
        console.log('LoginName',name);
        if(name == null){

        }else{
            this.setState({
                name:name
            });
        }
    }

    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>

                            <Text style={styles.name}>{this.state.name}</Text>

                    </View>

                    <View>
                        <TouchableOpacity onPress={this.navigateToScreen('HomeScreen')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-star"  />
                                <Text style={styles.text}>
                                    Home
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('Profile')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-contact"  />
                                <Text style={styles.text}>
                                    Profile
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('Booking')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-time"  />
                                <Text style={styles.text}>
                                    Booking History
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('PrivacyPolicy')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-person"  />
                                <Text style={styles.text}>
                                    Privacy Policy
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('RefundPolicy')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-redo"  />

                                <Text style={styles.text}>
                                    Refund Policy
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('Terms')}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-information-circle"  />
                                <Text style={styles.text}>
                                    Terms Of Use
                                </Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onClickLogout.bind(this)}>
                            <View style={styles.navItemStyle}>
                                <Icon style={styles.icon} name="ios-log-out"  />
                                <Text style={styles.text}>
                                    Log out
                                </Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    onClickLogout(){
        Alert.alert(
            'Are you sure to logout',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress:this.onPressOk.bind(this) },
            ],
            { cancelable: false }
        )
    }
    onPressOk(){
        AsyncStorage.removeItem('token', (err) => {
            console.log('KeyRemoved')
        });
        this.props.navigation.navigate('Login');

    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;