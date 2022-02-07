import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../Constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';


const IconText = (props) => {
  return(
    <View style={[styles.Container, props.style]}>
      {props.children}
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Container:{
    width: '93%',
    paddingHorizontal: 8,
    marginTop: 8,
    flexDirection: 'row',
  },
  text:{
    fontSize: 12, 
    color: colors.white,
    marginLeft: 4,
  }
});

export default IconText;
