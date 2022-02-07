import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FixedContainer = (props) => {
  return(
    <View style={[styles.container, props.topContainer]}>
      <View style={[styles.absoluteContainer, props.style]}>
        {props.children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center'
  },
  absoluteContainer:{
    position: 'absolute', 
    top: -230
  }
})

export default FixedContainer;