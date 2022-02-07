import React, { useEffect } from 'react';
import { Dimensions, Image, Text, StatusBar, StyleSheet, View } from 'react-native';
import CompanyLabel from '../Components/atoms/CompanyLabel';
import colors from '../Constants/colors';
import { CommonActions } from '@react-navigation/native';
import Constants from '../Constants/Constants.json';
import { userLogin } from '../redux/slices';
import { useSelector } from 'react-redux';
import FadeAnimation from '../Components/molecules/FadeAnimation';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';


const SplashScreen = ({ navigation }) => {
  const user = useSelector(userLogin)

  useEffect(async () => {

    let Token = await AsyncStorage.getItem("Auth_Token")
    if (Token) {
      Axios.defaults.headers.common['Authorization'] = Token;
    }
  //  let lang =  await AsyncStorage.getItem("language")
  //  if(lang){
  //    await AsyncStorage.setItem("language",lang)
  //  }

    setTimeout(() => {
      if (user != null) {
        if (user.type == 'employer') {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.EmployerDrawerStack }] }))
        }
        else {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.DrawerNavigation }] }))
        }
      }
      else {
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.LoginScreen }] }));
      }
    }, 3000)
  }, [])




  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.primaryColor} />

      <Image source={require('../../assets/bgUp.jpg')} style={styles.image} />

      <View style={styles.logoContainer}>

        <FadeAnimation>

          <Image resizeMode='contain' source={require('../../assets/logo.png')} style={styles.logo} />

          <CompanyLabel style={{ color: colors.white, marginTop: 15 }} />

        </FadeAnimation>

      </View>

      <Image source={require('../../assets/bgDown.jpg')} style={styles.image} />

    </View>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: colors.primaryColor,
    flex: 0.5,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    width: '100%'
  },
  logo: {
    flex: 0.9,
    width: Dimensions.get('window').width * 0.75,
  },
})

export default SplashScreen;