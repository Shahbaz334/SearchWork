import { ReactNative, I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
// import Preference from 'react-native-preference';
import I18n from 'react-native-i18n';
import AsyncStorage from "@react-native-community/async-storage"

// Import all locales
import en from '../Language/English.json'
import sp from '../Language/Spanish.json'

import { getLanguages } from 'react-native-i18n';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
    en,
    sp,
};

let mylang;


const currentLocale = I18n.currentLocale();



StoreLanguage()

export async function StoreLanguage() {
    // let lang = Preference.get('language');
   
    let lang = await AsyncStorage.getItem('language');
   
    // I18n.defaultLocale = "en"
    I18n.locale=lang
   
   
};
//
 
export async function ChangeLanguage(language) {
    AsyncStorage.setItem(
        "language",language
    )
    let lang = await AsyncStorage.getItem('language');
    // let lang = Preference.get('language');
   
    console.log("lang", lang);
    console.log("On Language press...",language);
  
    if (language === "sp") {
      
         
        // I18nManager.forceRTL(true);
        console.log('hello spanish')
        RNRestart.Restart();
    } else {
       
        console.log("Helo English")
        RNRestart.Restart();
    }

    getLanguages().then(languages => {
        console.log(languages); // ['en-US', 'en']
      });


};
export function strings(name, params = {}) {

    return I18n.t(name, params);
};

export default I18n;