import React from 'react';
import { Image, StyleSheet } from 'react-native';

const EmployerLogo = ({style}) => {
  return(
    <Image
      source={require('../../../assets/logoGreen.png')}  
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

export default EmployerLogo;