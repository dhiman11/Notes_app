import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput,Image,ScrollView,TouchableOpacity } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { SQLite } from 'expo-sqlite';
import Image_slider from './Image_slider'; 
import { load_products,delete_images, click_images,insert_images, update_product } from '../models/all_models';
const db = SQLite.openDatabase('db.db'); 
const { width, height } = Dimensions.get('window');
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
 
export default class Edit_product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products_data: [],
            product_id:0,
            products_photos: [],
            loadingmore: false,
            product_name: '',
            fob_price: '',
            moq: '', 
            notes: '',
            user_id:0,
            message:""

        };
    }

    componentDidMount = async () => {

        let params = this.props.navigation.state.params;
        let product_id = params['product_id'];  
        this.setState({
            product_id:product_id
        });
        await this.get_data(product_id); 

 

    }


    process_data = async (rows, type) => {

        if (type == "product") {
            products =  rows[0];
            
            await this.setState({ 
                product_name: products.product_name,
                fob_price: products.fob_price,
                moq: products.moq,
                notes: products.note,
                products_photos:products.images,
                loadingmore: false
            })


        }    
    }

    get_data = async (product_id) => {  
        await load_products(0,0,product_id).then((response) => {
            var data   = JSON.parse(response);   
            this.process_data(data['data'], 'product')
        });   
    }

    go_supp_page=()=>{
        this.props.navigation.goBack(null);
    }


    /////DELETE IMAGES
    delete_image = async (image_id) => {  
       await delete_images(image_id).then((response)=>{
       let res = JSON.parse(response);
       alert(res.result);
        this.get_data(this.state.product_id); 
        });
    }
    
    
    click_img = async (id,table) =>{ 
        await click_images().then((response)=>{ 
            insert_images(id,table,response).then((results)=>{ 
               var data =  JSON.parse(results);
               if(data){
                  this.get_data(id); 
               } 
           })
        })  
    }

    update = async(product_id,product_name,fob,moq,notes)=>{
        await update_product(product_id,product_name,fob,moq,notes).then((response)=>{
            var data =  JSON.parse(response);
            if(data){
                this.setState({
                    message: data.result
                })
            }
        });
    }


    render() {
        return (
           

            <ScrollView>
                  <View style={{ backgroundColor: "#00000096", position: "absolute", zIndex: 999, paddingLeft: 20, paddingRight: 10 }}>
                <TouchableOpacity onPress={() => { this.go_supp_page() }} >
                    <Ionicons name="md-arrow-round-back" size={40}  style={{ color:"#b9b9b9", marginRight: 10,opacity:0.8 }} />
                </TouchableOpacity>
                </View>

                <Image_slider style={{marginBottom:30}} Images_data={this.state.products_photos} />
              
               <TouchableOpacity style={styles.add_new_photo} onPress={()=>{this.click_img(this.state.product_id,'products')}}>
                    <Image   source={require('../../assets/img/camera.png')}  style={{ width: 40, height: 40, marginLeft: 8 }} />
                    <Text style={{color:"#fff",marginLeft:9}}>+ Add</Text>
               </TouchableOpacity>

                <TextInput
                        value={String(this.state.product_name)}
                        style={{position:"absolute",top:300,fontSize:28,fontWeight:"bold",color:"#fff",paddingLeft:10}}
                        textAlign="left"
                        // autoFocus={true} 
                        onChangeText={(text) => this.setState({ product_name: text })}
                        placeholderTextColor='#818181'
                        placeholder="Product Name*"
                        // ref={component => this._textInput1 = component}
                    />

                <View style={styles.input_container}> 

                    <Text style={styles.label}>Fob price</Text>
                  
                    <TextInput
                        value={String(this.state.fob_price)}
                        style={styles.inputfields} 
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ fob_price: text })}
                        placeholderTextColor='#818181'
                        placeholder="Fob price"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Moq</Text>
                    <TextInput
                        value={String(this.state.moq)}
                        style={styles.inputfields}
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ moq: text })}
                        placeholderTextColor='#818181'
                        placeholder="Moq"
                        // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Note</Text>
                    <TextInput
                        value={String(this.state.notes)}
                        multiline={true}
                        style={styles.inputfields}
                        textAlign="left"
                        onChangeText={(text) => this.setState({ notes: text })}
                        placeholderTextColor='#818181'
                        placeholder="Note"
                        // ref={component => this._textInput1 = component}
                    />

        <Text style={{ color: "red", textAlign: "left",marginBottom: 10 }}>{this.state.message}</Text>
                    <TouchableOpacity
                            onPress={() => { this.update(this.state.product_id,this.state.product_name,this.state.fob_price,this.state.moq,this.state.notes) }}
                            style={{ textAlign: "center", backgroundColor: "#176fc1", width: 100, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,marginTop:10,marginBottom: 20, }}>
                            <Text style={{ color: "#fff", textAlign: "center" }}>Update</Text>   
                    </TouchableOpacity>



              
                <Text style={styles.label}>All Images</Text>
               
                {   
                       this.state.products_photos.map((item, index) => ( 
                     
                            (item.photo_id != -1 ?
                                    <View key={index} style={styles.bulk_images}>
                                        <TouchableOpacity style={styles.trash_images}  onPress ={()=> { this.delete_image(item.photo_id) } } > 
                                            <Text><MaterialCommunityIcons name="trash-can" size={25} color="red"  />Delete image </Text> 
                                        </TouchableOpacity>
                                        
                                        <Image
                                            style={this.state.zoomimage ? styles.zoom_images :styles.images }
                                            source={{ uri: item.src }} /> 
                                        
                                    </View>
                                :
                                <View key={index}>
                                    <Text>No images found</Text>
                                </View>
                                    )
                          
                       ))
                   }  
               
                 </View> 
            </ScrollView>
        );
    }
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
    },
    buttons: {
        alignItems: "flex-end",
        textAlign: "center",
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    add_supp: {
        backgroundColor: '#176fc1',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        minWidth: 130,
        maxWidth: 130,

    },
    button: {
        width: '20%'
    },
    label: {
        fontWeight: "bold",
        marginTop: 10,
    },
    inputfields: {
        alignSelf: 'stretch',
        opacity: 0.4, 
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 40,
        minWidth: 300,
        borderColor: "#fff",
        borderWidth: 1,
       
    },
    response: {
        fontSize: 20,
        color: "red",
        marginBottom: 0
    },
    heading: {
        fontSize: 18,
        fontWeight: "normal",
        borderColor: "#176fc1",
        borderWidth: 1,
        backgroundColor: "#176fc1",
        color: "#fff",
        padding: 5,
        marginBottom: 10
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    input_container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    images: {
        width: width-20,
        height: height
    },
    zoom_images: {
        width: width-20,
        height: height
    },
    bulk_images:{
        marginBottom:10
    },
    trash_images:{
        position:"absolute",
        right:0,
        zIndex:99
    },
    add_new_photo:{
        position:"absolute",
        right:10,
        zIndex:99,
        top:290
    }
});