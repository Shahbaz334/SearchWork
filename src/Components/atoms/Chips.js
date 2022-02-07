import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../Constants/colors';

const Chips = (props) => {
  return(
    <View style={[styles.Container, props.style]}>

      {props.children}
      
      <Text style={styles.Text}>{props.title}</Text>

    </View>
  )
}

const styles =  StyleSheet.create({
  Container:{
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: colors.primaryColorLight, 
    borderRadius: 20, 
    padding: 8,
  },
  Text:{
      marginLeft: 4, 
      fontWeight: 'bold',
      fontSize: 11, 
      color: colors.gray
    }
});

export default Chips;