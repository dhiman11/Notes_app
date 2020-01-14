import { api_name } from "../Settings";

 
    //This is Homepage Events view
    export function load_events(){  
  
        return    fetch(api_name+'Events/index', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: 1,
            }),
        }).then((response) => response.json())
            .then((responseJson) => { 
      
                let fetch_data =
                {
                    Events_list: responseJson.interval_list_select,
                    Last_events_list: responseJson.interval_list,
                    headername: responseJson.header_name
                };
               
                result = JSON.stringify(fetch_data);
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
        export function load_products(supp_id,limit){  
        

            return    fetch(api_name+'Events/load_product', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supp_id: supp_id   ,
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



 