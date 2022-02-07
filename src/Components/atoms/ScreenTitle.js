import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../Constants/colors';

const ScreenTitle = ({title, style}) => {
  return(
    <Text style={[styles.text, style]}>{title}</Text>
  )
}

const styles = StyleSheet.create({
  text:{
    alignSelf: 'center',  
    color: colors.white, 
    fontSize: 22, 
    fontWeight: 'bold',
  },
});

export default ScreenTitle;