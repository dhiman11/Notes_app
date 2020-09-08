//import liraries
import React, { Component } from 'react';
import { View, FlatList, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, AsyncStorage } from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import Last_supplier from './Last_supplier.js';
import Images_upload_view from './Images_upload_view.js';
import { SafeAreaView } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
 
////////////////////SQLLITE CONNECTION
import { SQLite } from 'expo-sqlite';
import { insert_contact } from '../../models/all_models.js';
const db = SQLite.openDatabase('db.db');
//////////////////////////////////////

class Create_contacts extends Component {


    constructor(props) {
        super(props);
        //////////////////
        this.state = {
            user_id: 0,
            user_name: '',
            event_id: 0,
            lastsupp: [],
            supplier_name: '',
            supplier_id: 0,
            contact_name: '',
            position: '',
            phone: '',
            email: '',
            notes: '',
            images: [],
            response: ' ',
            type: '',
            isCapturing: false,
            show_s_create_btn: false

        }
        ///////////////////
        
     

    }

    componentDidMount() {  

        if(this.props.single_supp){
            this.setState({
                supplier_id: this.props.supp_id,
                supplier_name: this.props.suppliername,
            })
        }else{

        }

 
 





        /////////////////////////////////////////////////////

        this.getData();
        this.con_pro_data();




    }

    /////////////////GET COOKIES DATA /////////////////////
    ///////////////////////////////////////////////////////
    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('selected_event_id');
            ///////////////////////     
            this.setState({
                event_id: value,
            });
            //////////////////////////
            if (value !== null) {
                // value previously stored
            }
        } catch (e) {
            // error reading value
        }
    }







    con_pro_data = () => {




    }



    // Choose images from camera
    ///////////////////////////
    choose_images = async () => { 
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL); 
        if (status == 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');
            // alert(status)
        } else {
            // alert(status)
        } 
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
            quality:0.5
        });

        // console.log(result.base64);
        var img_array = []; 
        if(result.base64){
            img_array.push(result.base64);
        }else{ 
        }  
        this.setState({
            images: [...this.state.images, ...img_array]
        });   
    }

    // Click images from camera 
    ///////////////////////////
    click_images = async () => { 
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');

        } 
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            base64: true,
            quality:0.5
        });
  
        var img_array = []; 
        if(result.base64){
            img_array.push(result.base64);
        }else{ 
        }

        this.setState({
            images: [...this.state.images, ...img_array]
        });
 
    }


    ////// Set supplier id for the contact
    //////////////////////////////////////
    update_supp_id = (val1) => {

        this.setState({
            supplier_id: val1.supplier_id,
            supplier_name: val1.suppliername,
            show_s_create_btn: false
        });



    }

    ///////////////////////////////////////

    //// Create new supplier////

 


 
    close_modal = ()=>{   
        this.props.handle_visibility(false,"contacts");
    }  

    ////// POST Form data//////////////////
    //////////////////////////////////////
    fetchContactdata = () => {

        this.setState({
            response: " Note: Please wait we saving your data .... ",
        });



        let eventid = this.state.event_id;
        let supplier_name = this.state.supplier_name;
        let supplier_id = this.state.supplier_id;
        let contact_name = this.state.contact_name;
        let position = this.state.position;
        let phone = this.state.phone;
        let email = this.state.email;
        let notes = this.state.notes;
        let images = this.state.images;

        if (supplier_name != '') {
            if (contact_name != '') {
                if (images.length > 0) {

                    /*************** */
                   
                    insert_contact(eventid, supplier_name, supplier_id, contact_name,position,phone,email,notes,images).then((response) => {
                        var supp_data = JSON.parse(response);
                        if(supp_data){
                            
                        }
                        this.close_modal();
                        
                    });


                    /* INSERT CODE HERE */

                } else {
                    alert('Please Choose images  ');
                    this.setState({
                        response: " Please choose images "
                    })
                }
            }else {
                alert('Please Fill Contact name ');
                this.setState({
                    response: " Please Fill Contact name "
    
                })
            }
        } else {
            alert('Please Fill Supplier name ');
            this.setState({
                response: "Please Fill Supplier name "

            })
        }

    }


    render() {

        return (

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View >

                        <View>
                            <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "bold", color: "#000000" }}>CREATE CONTACT</Text>
                       
                          {this.props.single_supp?
                           <Last_supplier update_supp_id={this.update_supp_id.bind(this)} suppliername={this.props.suppliername} supplier_id={this.props.supp_id}   />
                            :<FlatList
                            numColumns={3}
                            data={this.state.lastsupp}
                            //Item Separator View this.state.lastsuppliers
                            renderItem={({ item }) => (

                                <Last_supplier update_supp_id={this.update_supp_id.bind(this)} suppliername={item.supplier_name} supplier_id={item.supplier_note_id} data={item} />

                            )}

                            ListFooterComponent={this.renderFooter}
                            keyExtractor={(item, index) => index.toString()}

                        />}


                            {/* <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) =>
                                    this.setState({
                                        supplier_name: text,
                                        show_s_create_btn: true
                                    })
                                }
                                placeholderTextColor='#818181'
                                placeholder="Supplier Name*"
                                value={this.state.supplier_name}
                            /> */}
                         
                        </View>

                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ contact_name: text })}
                                placeholderTextColor='#818181'
                                placeholder="Contact Name*"
                                ref={component => this._textInput1 = component}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ position: text })}
                                placeholderTextColor='#818181'
                                placeholder="Position"
                                ref={component => this._textInput2 = component}

                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ phone: text })}
                                placeholderTextColor='#818181'
                                placeholder="Phone"
                                keyboardType={'phone-pad'}
                                ref={component => this._textInput3 = component}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={styles.inputfields}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ email: text })}
                                placeholderTextColor='#818181'
                                placeholder="Email"
                                keyboardType={'email-address'}
                                ref={component => this._textInput4 = component}
                            />
                        </View>

                        <View>
                            <TextInput
                                multiline={true}
                                numberOfLines={10}
                                style={styles.textarea}
                                textAlign="left"
                                onChangeText={(text) => this.setState({ notes: text })}
                                placeholderTextColor='#818181'
                                placeholder="Notes"
                                ref={component => this._textInput5 = component}
                            />
                        </View>
                        {/* <Image 
                        style ={{width:25,height:25}}
                        source={require('../assets/img/search.png')}
                         /> */}


                        <View>
                            <Text style={styles.response}>{this.state.response}</Text>
                        </View>
                        {/* <View style={{alignItems:"center",alignContent:"center"}}>
                                    <TouchableOpacity
                                //  onPress={() => {this.submitForm()}}
                                    style={{backgroundColor:"#176fc1",width:100,paddingLeft:20,paddingRight:20,paddingTop:10,paddingBottom:10}}>
                                        <Text style={{color:"#fff"}}>Save</Text>
                                    </TouchableOpacity>
                                </View> */}
                        <View style={styles.buttons}>

                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.choose_images() }}
                                    style={{ width: 40 }}>
                                    <Image
                                        source={require('../../../assets/img/gallery.png')}
                                        style={{ width: 40, height: 40, marginLeft: 8 }}
                                    />
                                    {/* <Text style={{color:"#000000"}}> GALLERY</Text> */}
                                </TouchableOpacity>
                            </View>




                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.click_images() }}
                                    style={{ width: 40 }}>
                                    <Image
                                        source={require('../../../assets/img/camera.png')}
                                        style={{ width: 40, height: 40, marginLeft: 8 }}
                                    />
                                    {/* <Text style={{color:"#000000"}}>CAMERA</Text> */}
                                </TouchableOpacity>
                            </View>




                            <View style={styles.button}>
                                <TouchableOpacity
                                    onPress={() => { this.fetchContactdata() }}
                                    style={{ textAlign: "center", backgroundColor: "#176fc1", width: 100, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
                                    <Text style={{ color: "#fff", textAlign: "center" }}>SAVE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View>
                            <FlatList
                                numColumns={3}
                                data={this.state.images}
                                //data={this.state.images} 
                                //Item Separator View this.state.lastsuppliers
                                renderItem={({ item }) => (
                                    <Images_upload_view base64img={item} />
                                )}
                                ListFooterComponent={this.renderFooter}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View>





                    </View>
                </ScrollView>
            </SafeAreaView>
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

    inputfields: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginTop: 15,
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 40,
        minWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15
    },
    textarea: {
        alignSelf: 'stretch',
        opacity: 0.4,
        marginTop: 15,
        fontSize: 18,
        backgroundColor: "#fff",
        maxHeight: 150,
        minWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 15,
        textAlignVertical: 'top',
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
    }
});


//make this component available to the app
export default Create_contacts;
