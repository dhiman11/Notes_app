 
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
 
 
// create a component
class My_events extends Component {

    addContactProduct(event_id){
      this.props.updateState(event_id); 
    }
    
    load_events_suppliers(event_id,eventname){
        var event_values =  {"event_id":event_id,"event_name":eventname} ;

        this.props.load_supplier_page(event_values); 
    }

    render() { 
            return ( 
                <View> 
                    <TouchableOpacity  onPress ={() => { this.load_events_suppliers(this.props.eventid,this.props.eventname) }} >
                        <View>
                            <Image style ={{width:80,height:70,marginRight:15}} 
                            source={require('../../../assets/img/eventicon.png')}
                            />
                           
                            <Text numberOfLines={1} ellipsizeMode ="tail" style={styles.eventname}>{this.props.eventname}</Text>
                            <Text numberOfLines={1} ellipsizeMode ="tail" style={styles.cityname}>{this.props.eventcity}</Text>
                            <Text numberOfLines={1} ellipsizeMode ="tail" style={styles.ondate}>{(this.props.from_date?"on-"+this.props.from_date:"")}</Text>
                            {/* <Text  >{this.props.arrayid}</Text> */}
                        </View>   
                    </TouchableOpacity>

                    <TouchableOpacity style={{position:"absolute",top:10}}  onPress ={() => { this.addContactProduct(this.props.eventid) }} >
                         <View style={styles.inline_block}>  
                            <Image style={{ width: 15, height: 15 }}
                            /> 
                            <Text>Add</Text>
                        </View>
                    </TouchableOpacity> 
                </View>  
                    
            );
        
    }
}

// define your styles
const styles = StyleSheet.create({
    eventname:{
        
        fontWeight:"bold",
        fontSize:12,
       
        flex: 1,
        flexWrap: 'wrap',
        width:90
    },
    inline_block: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    cityname:{
        fontSize:10,  
        color:"#565656"
    },
    ondate:{
        fontSize:10,
        marginBottom:10,
        color:"#565656"
    }
});

//make this component available to the app
export default My_events;
