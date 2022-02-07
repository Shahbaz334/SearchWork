import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../Constants/colors';

const Divider = ({style}) => {
  return(
    <View style={[styles.divider, style]}/>
  )
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    borderRadius: 10,
    backgroundColor: colors.primaryBorderColor,
  }
});

export default Divider;