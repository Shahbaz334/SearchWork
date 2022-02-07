import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../../Constants/colors';

const SmallButton = ({title, onPress, style, titleStyle}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container:{
    backgroundColor: colors.primaryColor, 
    borderRadius: 25, 
    justifyContent: 'center', 
    padding: 12, 
    alignItems: 'center'
  },
  title:{
    fontSize: 16, 
    color: colors.primaryColor, 
    fontWeight: 'bold'
  }
});


export default SmallButton;
