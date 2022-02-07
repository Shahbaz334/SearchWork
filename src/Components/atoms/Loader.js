import React from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import colors from '../../Constants/colors';
import EmployerLogo from './EmployerLogo';
import Logo from './Logo';


const Loader = () => {
  return(
    <View style={styles.Container}>
     
      <StatusBar backgroundColor={colors.primaryColor}/>

      <Logo />

      <ActivityIndicator 
        style={{marginTop: 10}}
        size='large'
        color={colors.white}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: colors.primaryColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;