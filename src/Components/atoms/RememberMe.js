import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Constants/colors';

const RememberMe = ({onPress, iconName, textStyle, style}) => {
  return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.conatiner, style]}
        onPress={onPress}
      >
        <MaterialIcons name={iconName} size={18} color={colors.primaryColor} />
        <Text style={[styles.text, textStyle]}>
          Remember Me
        </Text>
      </TouchableOpacity>

  )
}

export default RememberMe

const styles = StyleSheet.create({
  conatiner:{
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  text:{
    marginLeft: 3, 
    color: colors.gray, 
    fontWeight: '700', 
    fontSize: 12
  },
})
