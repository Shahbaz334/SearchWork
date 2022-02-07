import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Divider from '../atoms/Divider';

const ProfileTextField = ({title, multiline, keyboardType, value, onChangeText, editable, maxLength,placeholder }) => {
  return (
    <View style={{paddingHorizontal: 10}}>
    
    <View style={styles.container}>
      
      <Text style={styles.title}>{title}</Text>
      
      <TextInput
        style={styles.textField}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        keyboardType={keyboardType}
      />

    </View>

    <Divider />

    </View>
  )
}

const styles = StyleSheet.create({
  container:{ 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  title:{
    width: Dimensions.get('window').width * 0.35, 
    fontSize: 16,
  },
  textField:{
    marginLeft: 7, 
    flex: 1,
    fontSize: 15,
  }
})
export default ProfileTextField;