import React from 'react';
import { Dimensions, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Constants/colors';

const Button = ({title, iconName, style, titleStyle, onPress, iconColor, disabled,}) => {
  return(
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
        {
          iconName ?
            <MaterialIcons 
              name={iconName} 
              size={25} 
              //style={{marginLeft: 3}} 
              color={iconColor ? iconColor :  colors.white}
              
            />
          : null
        }

        <Text style={[styles.text, titleStyle]}>{title}</Text>
                
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button:{
    backgroundColor: colors.buttonColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height * 0.06,
  },
  text:{
    fontSize: 18, 
    color: colors.white, 
    fontWeight: 'bold'
  }
});

export default Button;