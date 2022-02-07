import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const HeaderImage = ({style}) => {
  return(
    <Image 
      source={require('../../../assets/bgUpG.jpg')} 
      style={[styles.image, style]} 
    />
  )
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.33,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  }
});

export default HeaderImage;