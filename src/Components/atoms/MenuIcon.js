import React from 'react';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../Constants/colors';

const MenuIcon = ({onPress, iconColor}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Entypo name='menu' size={35} color={iconColor ? iconColor : colors.white} />
    </TouchableOpacity>
  )
}

export default MenuIcon;
