export function  chooseImages()  {

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
        base64: true
    });

    // console.log(result.base64);
    var img_array = [];

    if(result.base64){
        img_array.push(result.base64);
    }else{
        
    }
     

    return img_array;



}