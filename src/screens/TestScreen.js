import React, {useState} from 'react';
import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
//import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../Constants/colors';
import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

const TestScreen = () => {

  const [address, setAddress] = useState('');

  //"lat": 29.7604267, "lng": -95.3698028}

  const Locations =
    [{
        title: 'Location 1', latitude: 29.7604267,
        longitude: -95.3698028,
        markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
        weight: 13
    },
    // {
    //     title: 'Location 2', latitude: 24.83170980,
    //     longitude: 67.00210948,
    //     markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
    //     weight: 19
    // },
    // {
    //     title: 'Location 3', latitude: 24.83073537,
    //     longitude: 67.02129903,
    //     markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
    //     weight: 18
    // },
    // {
    //     title: 'Location 4', latitude: 24.83073230,
    //     longitude: 67.10113298,
    //     markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
    //     weight: 12
    // },
    // {
    //     title: 'Location 5', latitude: 24.83079990,
    //     longitude: 67.02939980,
    //     markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
    //     weight: 2
    // },
    // {
    //     title: 'Location 6', latitude: 24.85072329,
    //     longitude: 67.02129803,
    //     markerImage: "https://icons-for-free.com/iconfiles/png/512/map+marker+icon-1320166582858325800.png",
    //     weight: 13
    // }
  ]

    Geocoder.init('AIzaSyCtZW9vSCRNnOGALEokj6a84LioFIHa3Z8');

    Geocoder.from(address).then(
      json => {
        var location = json.results[0].geometry.location;
        console.log('LOCATION:',location)
      }
    ).catch(error => console.log(error));

  return(

    <View>
      
      <TextInput 
        style={{height: 50, width: 350, borderRadius: 10, borderColor: 'gray', borderWidth: 2, marginTop: 10}}
        placeholder='Address'
        value={address}
        onChangeText={setAddress}
      />


    <View style={{ marginTop: 40, overflow: 'hidden', height: 600, width: 340, alignSelf: 'center', borderRadius: 20, borderWidth: 2, borderColor: 'gray', backgroundColor: 'red'}}>
      
      
      <MapView 
        provider={PROVIDER_GOOGLE}
        //showsUserLocation={true}
        style={{flex: 1, borderRadius: 20}}
        initialRegion={{
          latitude: 24.83073230,
          longitude: 67.10113298,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {
            Locations.map(marker => (
              <Marker
                key={marker.title}
                //draggable
                
                //image={{uri:('../../assets/pin.png'), width: 20}}
                //pinColor={colors.buttonColor}
                title='Hello There'
                // coordinate={{latitude: location.lat, longitude: location.lng}} 
                coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              />
            ))
          }
        </MapView>
    </View>
    </View>
  )
}

export default TestScreen;