import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const IconContainer = (props) => {
    return(
        <View style={[styles.Conatiner, props.ContainerStyle]}>
            {props.children}
          <Text style={props.style}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  Conatiner:{
    alignItems: 'center', 
    justifyContent: 'center', 
    //backgroundColor: 'white',
    flex: 0.9, 
    // height: 50,
    width: 70,
    borderRadius: 10
  }
})

export default IconContainer;