import React, { Component } from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Image } from 'react-native';

export default class My_suppliers extends Component {
 


  load_suppliers_data(supplier_id,suppliername){
    var supp_values =  {"supplier_id":supplier_id,"suppliername":suppliername} ;

    this.props.load_supplier_page(supp_values); 
}


  render() {
    return (

        <View> 
        <TouchableOpacity onPress ={() => { this.load_suppliers_data(this.props.supplier_id,this.props.suppliername) }} >
                <Image style ={{width:80,height:70,marginRight:15}} 
                source={require('../../../assets/img/eventicon.png')}
                /> 
                <Text numberOfLines={1} ellipsizeMode ="tail" style={styles.suppname}>{this.props.suppliername}</Text>
                {/* <Text  >{this.props.arrayid}</Text> */}
             
        </TouchableOpacity>
        </View>
 
    );
  }
}


// define your styles
const styles = StyleSheet.create({
    suppname:{
        
        fontWeight:"bold",
        fontSize:12,
        marginBottom:10,
        flex: 1,
        flexWrap: 'wrap',
        width:90
    }
});