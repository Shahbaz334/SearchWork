import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../../Constants/colors";


const ProfilePicture = ({style, imageStyle, emptyContainerStyle, onPress, disabled, iconSize, imageSource}) => {

  return(
    <>
    {
      imageSource != undefined && imageSource != false ? 
      <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
        <Image source={{uri: imageSource}} style={imageStyle}/>
      </TouchableOpacity> 
      : 
      <TouchableOpacity style={[styles.iconContainer, emptyContainerStyle]} onPress={onPress} disabled={disabled}>
          <FontAwesome5 name='user' size={iconSize} color={colors.gray} />
      </TouchableOpacity>
    }
    </>
  )
}

const styles = StyleSheet.create({
  iconContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: '#C5C4C7',
  },
  imageStyle:{
    flex: 1,
    width: '100%'
  }
});

export default ProfilePicture;