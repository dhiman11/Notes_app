import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default class Image_slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider_images: [],
            zoomimage: false
        };
    }

    sum_values=(val1,val2)=>{
        return parseInt(val1)+parseInt(val2);
    }


    render() {
        return (
            <View>

                <ScrollView 
                    horizontal={true}
                    indicatorStyle="black"
                    nestedScrollEnabled={true}
                    
                    pagingEnabled={true}
                    persistentScrollbar={true}
                    maximumZoomScale={2}
                    resizeMode="contain"
                    minimumZoomScale={1}
                >
                    {
                       
                        this.props.Images_data.map((item, index) => ( 
                            <View key={index} style={styles.index}>
                                <Image
                                    style={this.state.zoomimage ? styles.zoom_images :styles.images }
                                    source={{ uri: item.file_name }} /> 
                                  
                            </View>
                        ))
                    }
                </ScrollView>


            </View>


        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',


    },
    heading: {
        fontSize: 22,
        color: "#000000",
        marginTop: 10,
        width: 100,
        marginBottom: 20,
        fontWeight: "bold"
    },
    images: {
        width: width,
        height: 350
    },
    zoom_images: {
        width: width,
        height: height
    }
});