import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SmallDetails = ({label, value, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text>{label}</Text>
      <Text style={{ marginLeft: 3 }}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row'
  }
})

export default SmallDetails;