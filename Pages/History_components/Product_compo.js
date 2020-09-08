
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

class Product_compo extends Component {
 
    
    render() { 
        return (
            <View style={styles.Products}> 
               <View style={styles.prodiv}> 
                        <View style={{flexDirection:"row"}}>
                            <View style={{width:"25%"}}> 
                                    <Image source = {{uri:this.props.image}} style = {{ width: 80, height: 100 }}   />
                                </View>  

                            <View  style={{width:"75%"}}>   
                                <View> 
                                    <Text style={styles.title}>Product : {this.props.product_name}</Text>
                                </View>

                                <View>  
                                    <Text style={styles.fobprice}>Supplier :{this.props.supplier_name}</Text> 
                                </View>

                                <View>  
                                    <Text style={styles.fobprice}>USD :{this.props.fob_price}</Text> 
                                </View>
                                <View>  
                                    <Text>MOQ :{this.props.moq}</Text> 
                                </View>
                               
                                <View>  
                                    <Text>Note :{this.props.note}</Text> 
                                </View>
                               

                            </View>
                        </View>

                        </View>


            </View>
        )
    }


}
 

// define your styles
const styles = StyleSheet.create({
    Products: {
        flex: 1, 
        backgroundColor: 'red',
        color:"#fff",
        borderBottomColor: 'gray',
        borderBottomWidth: 1, 
        justifyContent: "flex-end", 
        alignItems: "flex-end",
        backgroundColor: '#fff', 
    },
    prodiv:{
        width:"100%",
        padding:10
    },
    title:{
        fontSize:15,
        fontWeight:"bold"
    },
    fobprice:{
        color:"red"
    }
 
});

//make this component available to the app
export default Product_compo;

