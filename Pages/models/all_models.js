import { api_name, cookies } from "../Settings";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
 

 
  

    //This is Homepage Events view
    export async function load_events(limit=0,u_id){   
    
    var user_id = await cookies.then((obj)  => {
        var data =     JSON.parse(obj);   
        return  data.user_id; 
    });
    
        
    return   await fetch(api_name+'Events/index', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                limit:limit
            }),
        }).then((response) => response.json())
            .then((responseJson) => { 
      
                let fetch_data =
                {
                    Events_list: responseJson.interval_list_select,
                    Last_events_list: responseJson.interval_list,
                    event_list_all: responseJson.event_list,
                    headername: responseJson.header_name
                };
               
                result = JSON.stringify(fetch_data);
                return result;

            })
            .catch((error) => {
                 console.error(error);
            });  
    }


    export async function tabs_data_load(limit,tab_name){

        if(tab_name == 'supplier'){
            funcation_name = 'load_suppliers_tab';
        }

        if(tab_name == 'products'){
            funcation_name =  'load_products_tab';
        }

        if(tab_name == 'contacts'){
            funcation_name =  'load_contacts_tab';
        }

    
        var user_id = await cookies.then((obj)  => {
            var data =     JSON.parse(obj);   
            return  data.user_id; 
        });

        return await   fetch(api_name+'Events/'+funcation_name, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                limit:limit
            }),
        }).then((response) => response.json())
            .then((responseJson) => {  
                result = JSON.stringify(responseJson);
                return result;

            })
            .catch((error) => {
                 console.error(error);
            });  
    }

    ///Load explorer suppliers
    export function load_suppliers(event_id){  
  
        return    fetch(api_name+'Events/load_suppliers', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_id: event_id,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {  
                result = JSON.stringify(responseJson);
                return result;

            })
            .catch((error) => {
                 console.error(error);
            });  
    }



        ///Load explorer products
        export function load_products(supp_id=0,limit=0,product_id=0){  
        

            return    fetch(api_name+'Events/load_product', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supp_id: supp_id   ,
                    limit:limit,
                    product_id:product_id           
                }),
            }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;
    
                })
                .catch((error) => {
                     console.error(error);
                });  
        }

        /* LOAD ALL CONTACTS */
        export function load_contacts(supp_id,limit,contact_id=0){    
            return    fetch(api_name+'Events/load_contacts', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supp_id: supp_id   ,
                    limit:limit,
                    contact_id:contact_id       
                }),
            }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;
    
                })
                .catch((error) => {
                     console.error(error);
                });  
        }

        /* INSERT SUPPLIERS  */

        export function insert_supplier(event_id,supplier_name,notes,images){    
            return     fetch(api_name+'Events/add_supplier', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id: event_id   ,
                    supplier_name:supplier_name,
                    notes:notes,
                    images:images
                }),
                }).then((response) => response.json())
                .then((responseJson) => { 
                    // console.log(responseJson);
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }





        export function delete_images(image_id){    
            return     fetch(api_name+'remove_images/'+image_id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }, 
                }).then((response) => response.json())
                .then((responseJson) => { 
                    // console.log(responseJson);
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }



        export function insert_contact(eventid, supplier_name, supplier_id, contact_name,position,phone,email,notes,images){    
            return     fetch(api_name+'Events/add_contacts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id: eventid   ,
                    supplier_name:supplier_name,
                    supplier_id:supplier_id,
                    contact_name:contact_name,
                    position:position,
                    phone:phone,
                    email:email,
                    notes:notes,
                    images:images
                }),
                }).then((response) => response.json())
                .then((responseJson) => { 
                    // console.log(responseJson);
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }


        export function insert_product(eventid, supplier_name, supplier_id, product_name,supp_ref,fobusd,moq,notes,images){    
            return     fetch(api_name+'Events/add_products', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_id: eventid   ,
                    supplier_name:supplier_name,
                    supplier_id:supplier_id,
                    product_name:product_name,
                    supp_ref:supp_ref,
                    fobusd:fobusd,
                    moq:moq,
                    notes:notes,
                    images:images
                }),
                }).then((response) => response.json())
                .then((responseJson) => { 
                    // console.log(responseJson);
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }





        export function save_user_image(image,user_id){    
            return     fetch(api_name+'Events/add_user_image', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id:user_id,
                    image:image
                }),
                }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }



        export function save_user_detailss(name,email,wechat,phone,new_password,user_id){    
           
            return fetch(api_name+'Events/update_user_data', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                   full_name:name,
                   email:email,
                   wechat:wechat,
                   phone:phone,
                   new_password:new_password,
                   user_id:user_id
                }),
                }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson); 
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }




        export function get_user_data(user_id){    
            return fetch(api_name+'Events/user_data', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user_id:user_id, 
                }),
                }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }


        export function get_cookie_data(cookie,parameter){ 


        }




        export async function click_images() { 
            
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
    
            } else{
               
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false, 
                    base64: true,
                    quality:0.5,
                    
                });
             
                var img_array = []; 
             
                if(result.base64){
                    img_array.push(result.base64);
                }else{ 
                }
            
                return img_array;
            }
        
        }

 

        export async function insert_images(id,table,images) { 

                var user_id = await cookies.then((obj)  => {
                    var data =     JSON.parse(obj);   
                    return  data.user_id; 
                });

            return await fetch(api_name+'insert_image', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    product_id:id,
                    table:table,
                    user_id:user_id,
                    images:images
                }),
                }).then((response) => response.json())
                .then((responseJson) => {     
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        export async function update_product(product_id,product_name,fob,moq,notes) { 
            return fetch(api_name+'Events/prooduct_update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    product_id:product_id, 
                    product_name:product_name, 
                    fob_price:fob, 
                    moq:moq,
                    note:notes
                }),
                }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });

        }

        
        export async function update_contact(contact_id,name,email,phone,position,notes) { 

            console.log(contact_id+"-"+name+"-"+email+"-"+phone+"-"+position+"-"+notes);
            return fetch(api_name+'Events/contact_update_api', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    contact_id:contact_id, 
                    contact_name:name, 
                    email:email, 
                    phone:phone,
                    position:position,
                    note:notes
                }),
                }).then((response) => response.json())
                .then((responseJson) => {  
                    result = JSON.stringify(responseJson);
                    return result;  
                  
                })
                .catch((error) => {
                    console.error(error);
                });

        }

        /* ***************** */




 