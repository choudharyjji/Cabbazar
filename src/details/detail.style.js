import {Dimensions} from "react-native";

const { height, width } = Dimensions.get('window');
const deviceHeight = height;
let deviceWidth = width;

export default {
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    containerHeader: {
        padding:10
    },

    containerContent: {
        flex:1,
        marginTop:5,
    },

    cardStyle:{
        marginTop:10,
        padding:10,
        width:'95%',
        height:"auto",
        backgroundColor:"#fff",
        borderRadius: 5,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: .5,
            height: .5
        },
        alignItems:'center',
        shadowOpacity: 0.8,
        elevation:3,
        alignSelf:'center',
    },
    cardFare:{
        padding:10,
        margin:10,
        width:deviceWidth-20,
        height:"auto",
        backgroundColor:"#fff",
        borderRadius: 5,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: .5,
            height: .5
        },
        alignItems:'center',
        shadowOpacity: 0.8,
        elevation:3,
        alignSelf:'center',
    },

    listText:{
        color:'#000',
        alignSelf:'center',
        backgroundColor:'transparent',
        fontSize: 18,
        marginRight:8,
        marginLeft:8,
    },
    input: {
        margin: 5,
        paddingLeft:"2%",
        height: 40,
        width:"80%",
        borderColor: 'rgba(0,0,0,0.7)',
        borderWidth: 1,
        borderRadius:5
    },

    SectionStyle: {
        marginTop:15,
        flex:7,
        width:"80%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.7)',
        height: 40,
        borderRadius: 5 ,
        margin: 5
    },

    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode : 'stretch',
        alignItems: 'center'
    },
    inputNumber: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        color: '#424242',
        textAlign:'center'
    },
    inputPlace: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft:10,
        color: '#424242',
    },
    searchIcon: {
        paddingLeft: 5,
        paddingTop:3
    },
}