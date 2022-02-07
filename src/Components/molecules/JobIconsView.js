// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import colors from '../../Constants/colors';
// import Entypo from 'react-native-vector-icons/Entypo';

// const JobIconsView = ({containerStyle, onPress, title, style, iconName, iconColor}) => {
//   return (
//     <View style={[styles.mainContainer, style]}>

//     <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.6}>
//       <Entypo name={iconName ? iconName : 'briefcase'} size={20} color={iconColor ? iconColor : colors.white}/>
//     </TouchableOpacity>
//     <Text style={{marginTop: 4, fontWeight: 'bold', fontSize: 11}}>{title}</Text>

//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   mainContainer:{
//     alignItems: 'center', 
//     height: 60,
//     width: 100
//   },
//   container:{
//     height: 40, 
//     width: 40, 
//     borderRadius: 20, 
//     backgroundColor: colors.primaryColor, 
//     alignItems: 'center', 
//     justifyContent: 'center'
//   }
// });

// export default JobIconsView;