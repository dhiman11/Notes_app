import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, AsyncStorage, Image } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { save_user_detailss,save_user_image, get_user_data,get_cookie_data } from './models/all_models';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { api_name,cookies } from './Settings';



export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id:"",
            base64_image: '',
            full_name: '',
            user_name: '',
            email: '',
            wechat: '',
            phone: '',
            update_response: '',
            new_password: '',
            profile_picture: api_name+"assets/users_images/no_image.jpg",
            request_token: ''

        };
 



    }

    componentDidMount = async () => {
       const value = await AsyncStorage.getItem('cookies');
       const data = await JSON.parse(value);  
      
       await this.setState({
        user_id:data['user_id']
       })
       await this.get_data(data['user_id']);
        
        this.props.navigation.addListener('willFocus', (route) => {
            this.get_data(data['user_id']);
        });
    }




    process_data = async (rows, type) => {

        if (type == "user") {

            this.setState({
                full_name: rows.full_name, 
                email: rows.email,
                wechat: rows.wechat_name,
                phone: rows.phone,
                profile_picture: rows.profile_pic,
            });

           

        }


    }


    get_data = async (user_id) => {

        await get_user_data(user_id).then((response) => {  
            var user_data = JSON.parse(response);
            this.process_data(user_data, 'user')
        });

    }

    log_out(key) {
 
        try {
            AsyncStorage.clear();
            this.props.screenProps.navigate("Auth"); 
        } catch (error) {
            alert('Login failed');
        }
        this.props.navigation.navigate('Auth');
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(key, (err, response) => {
                if (response) {
                    resolve(response); 
                    this.props.screenProps.navigate('Auth');
                    // this.props.navigation.navigate('Auth');
                } else {
                    reject(err);
                }
            });
        })

    }



    choose_images = async (user_id) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status == 'granted') {
            // alert('Sorry, we need camera roll permissions to make this work!');
            // alert(status)
        } else {
            // alert(status)
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
            quality: 0.5
        }).then((response) => {
            
            if(response.base64){
                var image = response.base64; 
                save_user_image(image, user_id).then((response) => {
                    if(response){
                       this.get_data(user_id);
                    }
                });
            }
      
        });

        // if(result.base64){
        //     this.setState({
        //         base64_image: result.base64
        //     });
        // }else{ 
        // }  
        // result.base64








    }

    save_user = (user_id) => {

        let full_name = this.state.full_name;
        let email = this.state.email;
        let wechat = this.state.wechat; 
        let phone = this.state.phone;
        let new_password = this.state.new_password;
 
   
        save_user_detailss(full_name,email,wechat,phone,new_password,user_id).then((response) =>{ 
            
            response = JSON.parse(response);
            console.log(response);
            
            if(response.result){
                this.setState({
                    update_response: "Updated successfully"
                })
          } else{
                this.setState({
                    update_response: "No changes Found"
                })
          }
        })
    }





    render() {
        return (
            <ScrollView>
                <View style={{ height: 200, backgroundColor: "#2e75b6", marginBottom: 80 }}>
                    <Text style={styles.user_name}>{this.state.full_name}</Text>


                    <View style={styles.user_frame} >
                        <TouchableOpacity onPress={() => this.choose_images(this.state.user_id)}>
                            <Image
                               
                                style={styles.image_settings}
                                source={{  
                                    uri: this.state.profile_picture,
                                    cache: 'force-cache'
                                 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ position: "absolute", right: 10, top: 10 }}>
                        <TouchableOpacity onPress={() => this.log_out('cookies')}>
                            <Entypo style={styles.inputIcon} name="log-out" size={34} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.searchSection}>
                    <Entypo style={styles.inputIcon} name="user" size={25} color="#656565" />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={this.state.full_name}
                        onChangeText={(searchString) => { this.setState({ full_name:searchString }) }}
                        underlineColorAndroid="transparent"
                    />
                </View>

                <View style={styles.searchSection}>
                    <Entypo style={styles.inputIcon} name="email" size={25} color="#656565" />
                    <TextInput
                        style={styles.input}
                        placeholder="User Email"
                        value={this.state.email}
                        onChangeText={(searchString) => { this.setState({ email:searchString }) }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.searchSection}>
                    <MaterialCommunityIcons style={styles.inputIcon} name="wechat" size={25} color="#656565" />
                    <TextInput
                        style={styles.input}
                        value={this.state.wechat}
                        placeholder="User Wechat"
                        onChangeText={(searchString) => { this.setState({ wechat:searchString }) }}
                        underlineColorAndroid="transparent"
                    />
                </View>

                <View style={styles.searchSection}>
                    <MaterialCommunityIcons style={styles.inputIcon} name="cellphone" size={25} color="#656565" />
                    <TextInput
                        style={styles.input}
                        placeholder="User Phone"
                        value={this.state.phone}
                        onChangeText={(searchString) => { this.setState({ phone:searchString }) }}
                        underlineColorAndroid="transparent"
                    />
                </View>

                <View style={styles.searchSection}>
                    <MaterialCommunityIcons style={styles.inputIcon} name="textbox-password" size={25} color="#656565" />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password (Leave empty if don't want to change)"
                        onChangeText={(searchString) => { this.setState({ new_password:searchString }) }}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View>
                                <Text style={{color:"red",marginTop:10,marginLeft:10 }} >{this.state.update_response}</Text>
                </View>

                <View style={{ alignSelf: 'flex-end', backgroundColor: "#2e75b6", height: 40, marginTop: 20, paddingTop: 9, width: 100, fontSize: 15, textAlign: "center", paddingLeft: 25, marginRight: 10 }}>
                    <TouchableOpacity onPress={() => this.save_user(this.state.user_id)}>
                        <Text style={{ color: "#fff" }}>Update</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        );
    }
}


const styles =
    StyleSheet.create({
        user_name: {
            alignItems: "center",
            alignContent: "center",
            fontSize: 25, color: "#fff",
            textAlign: "center",
            paddingTop: 80
        },
        user_frame: {
            height: 120,
            left: "37%",
            marginBottom: 100,
            width: 120,
            backgroundColor: "#fff",
            position: "absolute",
            top: 150,
            zIndex: 999,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: "#2e75b6"
        },
        searchSection: {
            flex: 1,
            height: 60,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: "#a7a7a7"
        },
        inputIcon: {
            paddingLeft: 20,
        },
        input: {
            flex: 1,
            minHeight: 40,
            zIndex: 100,
            paddingLeft: 20,
            backgroundColor: '#fff',
            color: '#424242',
        },
        image_settings:
        { 
            width: 116,
            height: 116,
            borderBottomWidth: 1,
            borderRadius: 60,
        }

    });
