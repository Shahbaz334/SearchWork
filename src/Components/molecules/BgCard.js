import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import colors from '../../Constants/colors';

const BgCard = ({onPress, bgImage, iconImage, title, style}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>

      <Image source={bgImage} style={styles.bgImage} />

      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Image source={iconImage} resizeMode='contain' style={styles.iconImage} />
        <Text style={{ fontWeight: 'bold', color: colors.white }}>{title}</Text>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center', 
    justifyContent: 'center'
  },
  bgImage:{
    width: Dimensions.get('window').width * 0.44, 
    height: Dimensions.get('window').height * 0.18, 
    borderRadius: 10 
  },
  iconImage:{
    width: 65, 
    height: 65, 
    alignSelf: 'center'
  }
});

export default BgCard;
