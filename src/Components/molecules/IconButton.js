import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Divider from '../atoms/Divider';
import colors from '../../Constants/colors';

const IconButton = (props) => {
  return (
    <View style={[styles.categoriesContainer, props.style]}>

      <View style={styles.iconContainer}>
        {props.children}
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity onPress={props.onPress}>
          <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>

        <Divider />

      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  categoriesContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  iconContainer:{
    backgroundColor: colors.white, 
    width: 30, 
    alignItems: 'center'
  },
  buttonContainer: {
    marginLeft: 8,
    flex: 1
  },
  text:{
    fontSize: 20
  }
});

export default IconButton;