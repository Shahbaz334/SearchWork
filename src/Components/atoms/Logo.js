import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({style}) => {
  return(
    <Image 
      source={require('../../../assets/logo.png')} 
      style={[styles.logo, style]}
    />
  )
}

const styles = StyleSheet.create({
  logo:{
    resizeMode: 'cover',
    height: 72,
    width: 150,
  },
});

export default Logo;