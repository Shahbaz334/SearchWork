import React, { useState } from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CompanyLabel from '../Components/atoms/CompanyLabel';
import {useSelector } from 'react-redux';
import Divider from '../Components/atoms/Divider';
import HeaderImage from '../Components/atoms/HeaderImage';
import Logo from '../Components/atoms/Logo';
import Button from '../Components/molecules/Button';
import FixedContainer from '../Components/molecules/FixedContainer';
import InputField from '../Components/molecules/InputField';
import LanguagePicker from '../Components/organisms/LanguagePicker';
import colors from '../Constants/colors';
import Constants from '../Constants/Constants.json';
import Loader from '../Components/atoms/Loader';
import ApiConstants from '../service/ApiConstants.json';
import { apiCall } from '../service/ApiCall';
import ErrorModal from '../Components/organisms/ErrorModal';
import CustomModal from '../Components/organisms/CustomModal';
import { type } from '../Components/organisms/CustomModal';
import { setLanguageSelected } from '../redux/slices';
import LocalStrings from '../Language/Strings'


const ForgotPassScreen = ({ navigation }) => {

  let selectedLang = useSelector(setLanguageSelected)


  const [country, setCountry] = useState('esp');
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isEmptyField, setIsEmptyField] = useState(false);

  async function forgetPassword() {

    let body = {
      email: email
    }

    setLoader(true)

    try {
      var response = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.ForgotPassword,
        body
      );
      console.log('pass',response)

      if (response.isAxiosError == true) {
        setModalMessage(response.response.data.error.messages.map(val => val + '\n'))
        setErrorModal(true)
      }
      else {
        setModalMessage(response.data.response.messages.map(val => val + '\n'))
        setModalVisible(true)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
    }
    finally {
      setLoader(false)
    }
  }

  if (loader == true) {
    return (
      <Loader />
    )
  }

  function onResetPassword() {
    if (email == '') {
      setIsEmptyField(true)
      setErrorModal(true)
      setModalMessage('Please enter your registered email address.')
    }
    else {
      forgetPassword()
      setIsEmptyField(false)
    }
  }

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  return (
    <View style={{ flex: 1 }}
    screenProps={{selectedLang}}
    >

      <StatusBar backgroundColor={colors.primaryColor} />

      <CustomModal
        type={type.confirm}
        isVisible={modalVisible}
        imageSource={require('../../assets/checked.png')}
        message={modalMessage}
        onPressOk={() => setModalVisible(false)}
      />

      <ErrorModal
        isVisible={errorModal}
        message={modalMessage}
        onPress={() => setErrorModal(false)}
      />

      <ImageBackground source={require('../../assets/blurBg.png')} style={styles.bgImage}>

        <HeaderImage />

        <FixedContainer>

          <View style={{ marginBottom: 12, flex: 1, flexDirection: 'row', marginTop: 25 }}>

            <View style={{ flex: 1 }}>
              <Logo />
            </View>

            <LanguagePicker
              viewStyle={{ width: 80 }}
              containerStyle={{ flex: 1 }}
              value={country}
              open={dropDownOpen}
              setOpen={() => setDropDownOpen(!dropDownOpen)}
              setValue={setCountry}
            />

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <View style={styles.loginFieldContainer}>

              <View style={styles.fieldContainer}>
                <Text style={styles.welcomeText}>{LocalStrings.forgotPassword}</Text>
                <Text style={{ fontSize: 12, color: 'gray', fontWeight: '700' }}>{LocalStrings.confirmEmail}</Text>

                <Divider style={{ marginTop: 10 }} />

                <InputField
                  textStyle={{ color: email == '' && isEmptyField == true ? 'red' : colors.primaryColor }}
                  style={{ marginTop: 22 }}
                  title={LocalStrings.email}
                  placeholder='Email Address'
                  keyboardType='email-address'
                  iconName='mail'
                  onEndEditing={() => {
                    console.log('hello:', ValidateEmail(email))
                  }}
                  value={email}
                  onChangeText={setEmail}
                />

                <Button
                  title={LocalStrings.resetPassword}
                  style={{ marginTop: 25 }}
                  onPress={() => onResetPassword()}
                />

                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center' }}>

                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 12 }}>{LocalStrings.already}</Text>

                  <TouchableOpacity onPress={() => navigation.navigate(Constants.screen.LoginScreen)}>
                    <Text style={styles.loginIn}>{LocalStrings.login}</Text>
                  </TouchableOpacity>

                </View>

                <Divider style={{ marginTop: 15 }} />

                <CompanyLabel style={{ marginTop: 15 }} />


              </View>

            </View>

          </View>

        </FixedContainer>

      </ImageBackground>

    </View>
  )
}

const styles = StyleSheet.create({
  bgImage: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('window').width,
  },
  loginFieldContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.9
  },
  fieldContainer: {
    padding: 15
  },
  welcomeText: {
    marginTop: 8,
    color: colors.primaryColor,
    fontSize: 22,
    fontWeight: 'bold'
  },
  loginIn: {
    marginLeft: 10,
    textDecorationLine: 'underline',
    color: colors.buttonColor,
    fontWeight: 'bold',
    fontSize: 12
  }
});

export default ForgotPassScreen;

