import React from 'react';
import { StyleSheet, View } from 'react-native';

const HeaderRowContainer = (props) => {
  return(
    <View style={[styles.container, props.style]}>
      
      <View style={styles.innerContainer}>
        {props.children}
      </View>
    
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    position: 'absolute', 
    width: '100%', 
    padding: 9,
  },
  innerContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
});

export default HeaderRowContainer;