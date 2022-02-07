import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../Constants/colors';

const Heading = ({title, style, textStyle}) => {
  return (
    <View style={[styles.Container, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Container:{
    padding: 10, 
    backgroundColor: colors.lightGray
  },
  text:{
    fontSize: 15
  }
});


export default Heading;