import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Constants from '../Constants/Constants.json';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import DrawerNavigation from './DrawerNavigation';
import EmployerDrawerStack from './EmployerDrawerStack';
import ModalScreen from '../screens/ModalScreen';


const {Screen, Navigator} = createStackNavigator();

const UnAuthorizedStack = () => {
    return(
        <Navigator initialRouteName={Constants.screen.SplashScreen} screenOptions={{headerShown: false}}>
          <Screen name={Constants.screen.SplashScreen} component={SplashScreen}/>
          <Screen name={Constants.screen.LoginScreen} component={LoginScreen}/>
          <Screen name={Constants.screen.ForgotPassScreen} component={ForgotPassScreen}/>
          <Screen name={Constants.screen.RegisterScreen} component={RegisterScreen}/>
          <Screen name={Constants.screen.EmployerDrawerStack} component={EmployerDrawerStack} />
          <Screen name={Constants.screen.DrawerNavigation} component={DrawerNavigation}/>
          <Screen name='ModalScreen' component={ModalScreen}/>
        </Navigator> 
    )
}


export default UnAuthorizedStack;

