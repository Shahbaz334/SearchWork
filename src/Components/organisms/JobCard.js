import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../../Constants/colors';
import Chips from '../atoms/Chips';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Icon } from 'react-native-vector-icons/Icon';

const JobCard = ({onPress, imageSource, jobTitle, jobDescription, location, duration, state, city}) => {
  return(
    <TouchableOpacity style={styles.Container} onPress={onPress}>
      
      <View style={{borderTopLeftRadius: 12, backgroundColor: colors.primaryColorLight, borderBottomRightRadius: 55, height: 65, width: 190, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={imageSource} resizeMode='contain' style={{height: 55, width: 120}}/>
      </View>
     
     <View style={{padding: 12, flex: 1}}>
     
      <Text 
        numberOfLines={1} 
        ellipsizeMode='tail' 
        style={{fontSize: 18, fontWeight: 'bold', color: colors.primaryColor}}
      >
        {jobTitle}
      </Text>
      
      <Text ellipsizeMode='tail' numberOfLines={3} style={{fontSize: 12}}>
        {jobDescription}
      </Text>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 'auto'}}>
        
        <Chips title={duration}>
          <AntDesign name='clockcircle' size={17} color={colors.gray}/>
        </Chips>

        <Chips title={location} style={{marginLeft: 10}}>
          <MaterialIcons name={'location-pin'} size={17} color={colors.gray}/> 
        </Chips>

      </View>

      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  Container:{
    backgroundColor: colors.white, 
    borderRadius: 12, 
    width: 300, 
    height: 207
  }
})

export default JobCard;
