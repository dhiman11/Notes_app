import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView,TouchableOpacity } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { SQLite } from 'expo-sqlite';
import Image_slider from './Image_slider';
import { load_contacts,delete_images, click_images,insert_images,update_contact } from '../models/all_models';
const db = SQLite.openDatabase('db.db');
const { width, height } = Dimensions.get('window');
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';


export default class Edit_contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts_data: [],
            contacts_photos: [],
            loadingmore: false,
            contact_id:0,
            contact_name: '',
            email: '',
            phone: '',
            position: '',
            notes: '',
            message:""

        };
    }

    componentDidMount = async () => {

        let params = this.props.navigation.state.params;
        let contact_id = params['contact_id'];
        this.setState({
            contact_id:contact_id
        });
        await this.get_data(contact_id);


    }


    process_data = async (rows, type) => {
        if (type == "contact") {
            console.log(rows);
            contacts = rows[0];
            await this.setState({
                contact_name: contacts.contact_name,
                email: contacts.email,
                phone: contacts.phone,
                position: contacts.position,
                notes: contacts.note,
                contacts_photos: contacts.images,
                loadingmore: false
            })


        }




    }


    get_data = async (contact_id) => {
        await load_contacts(0, 0, contact_id).then((response) => {
            var data = JSON.parse(response);
            this.process_data(data['data'], 'contact')
        });
    }




    go_supp_page=()=>{
        this.props.navigation.goBack(null);
    }


    delete_image = async (image_id) => {  
        await delete_images(image_id).then((response)=>{
        let res = JSON.parse(response);
        alert(res.result);
         this.get_data(this.state.contact_id); 
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



    update = async(id,name,email,phone,position,notes)=>{
        await update_contact(id,name,email,phone,position,notes).then((response)=>{
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
                        <Ionicons name="md-arrow-round-back" size={40} style={{ color: "#b9b9b9", marginRight: 10, opacity: 0.8 }} />
                    </TouchableOpacity>
                </View>
                <Image_slider style={{ marginBottom: 30 }} Images_data={this.state.contacts_photos} />

                <TouchableOpacity style={styles.add_new_photo} onPress={()=>{this.click_img(this.state.contact_id,'contacts')}}>
                    <Image   source={require('../../assets/img/camera.png')}  style={{ width: 40, height: 40, marginLeft: 8 }} />
                    <Text style={{color:"#fff",marginLeft:9}}>+ Add</Text>
               </TouchableOpacity>

                <TextInput
                    value={String(this.state.contact_name)}
                    style={{ position: "absolute", top: 300, fontSize: 28, fontWeight: "bold", color: "#fff", paddingLeft: 10 }}
                    textAlign="left"
                    // autoFocus={true} 
                    onChangeText={(text) => this.setState({ contact_name: text })}
                    placeholderTextColor='#818181'
                    placeholder="Contact Name*"
                // ref={component => this._textInput1 = component}
                />

                <View style={styles.input_container}>

                    <Text style={styles.label}>Position</Text>

                    <TextInput
                        value={String(this.state.position)}
                        style={styles.inputfields}
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ position: text })}
                        placeholderTextColor='#818181'
                        placeholder="Position"
                    // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        value={String(this.state.phone)}
                        style={styles.inputfields}
                        textAlign="left"
                        keyboardType="phone-pad"
                        onChangeText={(text) => this.setState({ phone: text })}
                        placeholderTextColor='#818181'
                        placeholder="Phone"
                    // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={String(this.state.email)}
                        multiline={true}
                        style={styles.inputfields}
                        textAlign="left"
                        onChangeText={(text) => this.setState({ email: text })}
                        placeholderTextColor='#818181'
                        placeholder="Note"
                    // ref={component => this._textInput1 = component}
                    />

                    <Text style={styles.label}>Notes</Text>
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
                            onPress={() => { this.update(this.state.contact_id,this.state.contact_name,this.state.email,this.state.phone,this.state.position,this.state.notes) }}
                            style={{ textAlign: "center", backgroundColor: "#176fc1", width: 100, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,marginTop:10,marginBottom: 20, }}>
                            <Text style={{ color: "#fff", textAlign: "center" }}>Update</Text>   
                    </TouchableOpacity>


                    <Text style={styles.label}>All Images</Text>
{/* 
                    {

                        this.state.contacts_photos.map((item, index) => (
                            <View key={index} style={styles.bulk_images}>
                                <Image
                                    style={this.state.zoomimage ? styles.zoom_images : styles.images}
                                    source={{ uri: item.src }} />

                            </View>
                        ))
                    } */}

                         
                {   
                       this.state.contacts_photos.map((item, index) => ( 
                     
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
        width: width - 20,
        height: 350
    },
    zoom_images: {
        width: width - 20,
        height: height
    },
    bulk_images: {
        marginBottom: 10
    },
    add_new_photo:{
        position:"absolute",
        right:10,
        zIndex:99,
        top:290
    },
    trash_images:{
        position:"absolute",
        right:0,
        zIndex:99
    }
});