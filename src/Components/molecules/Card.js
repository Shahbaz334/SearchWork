import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../Constants/colors';

const Card = ({style, title, imageSource, onPress}) => {
  return(
    <TouchableOpacity style={[styles.card, style]} activeOpacity={0.7} onPress={onPress}>

      <Image source={imageSource} resizeMode='contain' style={styles.image}/>

      <Text style={styles.text}>{title}</Text>

    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
  card:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.primaryColorLight,
    width: Dimensions.get('window').width * 0.44,
    height: Dimensions.get('window').height * 0.18,
    elevation: 8
  },
  bgImage:{
    flex: 1
  },
  text:{
    fontWeight: 'bold',
    color: colors.white
  },
  image:{
    width: 60,
    height: 60
  }
});

export default Card;
