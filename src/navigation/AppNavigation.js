import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import UnAuthorizedStack from './UnAuthorizedStack';
import LocalStrings from '../Language/Strings'
import { LogBox } from 'react-native'

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setLanguageSelected } from '../redux/slices';
import { t } from 'i18n-js';
LogBox.ignoreAllLogs(true)

const AppNavigation = () => {
  let selectedLang = useSelector(setLanguageSelected)
  LocalStrings.setLanguage(selectedLang)
  return (
    <NavigationContainer>
      <UnAuthorizedStack />
    </NavigationContainer>
  )
}

export default AppNavigation;