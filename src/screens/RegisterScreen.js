import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CompanyLabel from '../Components/atoms/CompanyLabel';
import { DateFormat } from '../Components/atoms/DateFormat';
import Divider from '../Components/atoms/Divider';
import HeaderImage from '../Components/atoms/HeaderImage';
import Loader from '../Components/atoms/Loader';
import Logo from '../Components/atoms/Logo';
import ProfilePicture from '../Components/atoms/ProfilePicture';
import Button from '../Components/molecules/Button';
import FixedContainer from '../Components/molecules/FixedContainer';
import InputField from '../Components/molecules/InputField';
import PasswordField from '../Components/molecules/PasswordField';
import { cityStates } from '../Components/organisms/CityStates';
import CustomModal from '../Components/organisms/CustomModal';
import CustomPicker from '../Components/organisms/CustomPicker';
import LanguagePicker from '../Components/organisms/LanguagePicker';
import StatePicker from '../Components/organisms/StatePicker';
import colors from '../Constants/colors';
import Constants from '../Constants/Constants.json';
import { apiCall } from '../service/ApiCall';
import ApiConstants from '../service/ApiConstants.json';
import { saveUserCredential, userCredential, setLanguageSelected, getLoggedInProfile } from '../redux/slices';
import { useDispatch, useSelector } from 'react-redux';
import RememberMe from '../Components/atoms/RememberMe';
import Axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import LocalStrings from '../Language/Strings'
import { strings } from '../Language/i18n'
import AsyncStorage from '@react-native-community/async-storage';
const RegisterScreen = ({ navigation }) => {

  let selectedLang = useSelector(setLanguageSelected)

  const [registerApiResponse,setRegisterApiResponse]=useState('');
  const [eye, setEye] = useState(true);
  const [otp, setOtp] = useState('');
  const [confirmEye, setConfirmEye] = useState(true);
  const [country, setCountry] = useState('esp');
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false);
  const [statePicker, setStatePicker] = useState(0);
  const [city, setCity] = useState(0);
  const [register, setRegister] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [gender, setGender] = useState(0);
  const [loader, setLoader] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [otpModal, setOTPModal] = useState(false);
  const [imageSelection, setImageSelection] = useState(false);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [onClickRememberMe, setOnClickRememberMe] = useState(false);
  const [randomNo, setRandmNo] = useState('')

  // useEffect(() => {
  //   var randomNumber = Math.floor(1000 + Math.random() * 9000);
  //   console.log(randomNumber);
  //   setRandmNo(randomNumber)

  // },[])

  const dispatch = useDispatch();

  const credentials = useSelector(userCredential);
  var credentialFields = { ...credentials }

  const cities = cityStates.filter((value) => value.state == statePicker)
  const cityItems = cities.length > 0 ? cities[0].cities : null


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  var bodyFormData = new FormData();

  bodyFormData.append('name', fullName)
  bodyFormData.append('email', email)
  bodyFormData.append('password', password)
  bodyFormData.append('phone', phone)
  bodyFormData.append('type', register == false ? 'employee' : 'employer')
  bodyFormData.append('address', address)
  bodyFormData.append('city', city)
  bodyFormData.append('state', statePicker)
  bodyFormData.append('zipcode', zipCode)
  bodyFormData.append('confirm_password', confirmPassword)
  register == false && bodyFormData.append('gender', gender)
  register == false && bodyFormData.append('dob', DateFormat(date))
  imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'profile_picture', type: 'image/*' })

  async function registerUser() {
    console.log("In Register Function......")
    try {
      setLoader(true)
      var apiResponse = await apiCall(ApiConstants.methods.POST, ApiConstants.endPoints.Register, bodyFormData);

      if (apiResponse.isAxiosError == true) {
        setErrorModal(true)
        setErrorMessage(apiResponse.response.data.error.messages.map(val => val + '\n'))
        setLoader(false);
        credentialFields.password = ''
        credentialFields.email = ''
        dispatch(saveUserCredential(credentialFields))
      }

      else {
        OTP()
        setRegisterApiResponse(apiResponse)
        console.log("Register API Response............", apiResponse.data)
        // if (onClickRememberMe == false) {
        //   credentialFields.password = ''
        //   credentialFields.email = ''
        //   dispatch(saveUserCredential(credentialFields))
        // }

        // Axios.defaults.headers.common['Authorization'] = `Bearer ${apiResponse.data.response.data.access_token}`;
        // await AsyncStorage.setItem("userId", apiResponse.data.response.data.id)

        // await AsyncStorage.setItem("Auth_Token", `Bearer ${apiResponse?.data?.response?.data?.access_token}`)
        // // dispatch(getLoggedInProfile(apiResponse.data.response.data))

        // if (apiResponse.data.response.data.type == 'employer') {
        //   navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.EmployerDrawerStack }] }));
        // }
        // else {
        //   navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.DrawerNavigation }] }));
        // }

        //setModalVisible(!modalVisible)
        setIsFieldEmpty(false)
        setLoader(false)
      }
    }
    catch (error) {
      console.log('Catch Body Error:', error)
      setLoader(false)
    }
  }


  async function OTP() {

    var random = Math.floor(1000 + Math.random() * 9000);
    console.log(random);
    setRandmNo(random)

    var OTP_Data = new FormData()
    OTP_Data.append('email', email)
    OTP_Data.append('otp', random)

    console.log("In OTP Function......", OTP_Data)
    try {
      setLoader(true)
      setOTPModal(true)

      var apiResponse = await apiCall(ApiConstants.methods.POST, ApiConstants.endPoints.OTP, OTP_Data);

      if (apiResponse.isAxiosError == true) {
        setErrorModal(true)
        setErrorMessage(apiResponse.response.data.error.messages.map(val => val + '\n'))
        setLoader(false);
      }

      else {
        console.log("OTP API Response............", apiResponse.data)
        setIsFieldEmpty(false)
        setLoader(false)
      }
    }
    catch (error) {
      console.log('Catch Body Error:', error)
      setLoader(false)
    }
  }
  // ----------------------------------------------------
  async function verifyOTP() {

    console.log("In Verify Function......")
    console.log(randomNo)
    // matchOtp = await AsyncStorage.getItem("OTP")
    try {
      // setLoader(true)


      if (otp == randomNo) {
        // setLoader(false)
        setModalVisible(false)
        // registerUser()
         if (onClickRememberMe == false) {
          credentialFields.password = ''
          credentialFields.email = ''
          dispatch(saveUserCredential(credentialFields))
        }

        Axios.defaults.headers.common['Authorization'] = `Bearer ${registerApiResponse.data.response.data.access_token}`;
        await AsyncStorage.setItem("userId",registerApiResponse.data.response.data.id)

        await AsyncStorage.setItem("Auth_Token", `Bearer ${registerApiResponse?.data?.response?.data?.access_token}`)
        // dispatch(getLoggedInProfile(apiResponse.data.response.data))

        if (registerApiResponse.data.response.data.type == 'employer') {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.EmployerDrawerStack }] }));
        }
        else {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.DrawerNavigation }] }));
        }
      } else {
        // setLoader(false)
        alert("Invalid Otp")
      }
    }
    catch (error) {
      console.log('Catch Body Error:', error)
      setLoader(false)
    }
  }

  if (loader == true) {
    return (
      <Loader />
    )
  }

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  function fieldsMissingCheck() {
    if (register == true) {
      if (fullName == '' || email == '' || phone == '' || address == '' || statePicker == 0 || city == 0 || zipCode == '' || password == '' || confirmPassword == '') {
        return 'Some fields are missing.'
      }
      else {
        return 'Account Created.'
      }
    }
    else {
      if (imageUrl == '' || fullName == '' || email == '' || phone == '' || gender == '' || address == '' || statePicker == 0 || city == 0 || zipCode == '' || password == '' || confirmPassword == '') {
        return 'Some fields are missing.'
      }
      else {
        return 'Account Created.'
      }
    }
  }


  const pickFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 500,
      maxWidth: 500
      //includeBase64: true
    }, (response) => {
      if (response?.didCancel) {
        setImageUrl('')
      }
      else if (response?.errorMessage) {
        console.log('Error:', response?.errorMessage)
      }
      else {
        const source = response?.assets[0].uri
        setImageUrl(source)
        setImageSelection(false)
      }
    })
  }

  const camera = () => {
    launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      maxHeight: 500,
      maxWidth: 500
    }, (response) => {
      if (response?.didCancel) {
        setImageUrl('')
      }
      else if (response?.errorMessage) {
        console.log('Error:', response?.errorMessage)
      }
      else {
        const source = response?.assets[0].uri
        setImageUrl(source)
        setImageSelection(false)
      }
    })
  }

  return (
    <ScrollView 
    screenProps={{selectedLang}}
    style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <Modal animationType="slide"
        transparent visible={otpModal}
        presentationStyle="overFullScreen"
        onDismiss={() => setOTPModal(false)}
        onRequestClose={() => setOTPModal(false)}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.otpText}>{LocalStrings.verification}</Text>
            <InputField
              textStyle={{ color: isFieldEmpty == true && email == '' ? 'red' : colors.primaryColor }}
              title={LocalStrings.otp}
              placeholder={"Enter OTP"}
              autoCapitalize='none'
              keyboardType='numeric'
              value={otp}
              onFocus={false}
              onChangeText={setOtp}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setOTPModal(false)}
                style={[styles.Btn, { backgroundColor: colors.gray }]}>
                <Text style={styles.BtnText}>{LocalStrings.Cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => verifyOTP()}
                style={[styles.Btn, { backgroundColor: colors.buttonColor }]}>
                <Text style={styles.BtnText}>{LocalStrings.verify}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <CustomModal
        isVisible={modalVisible}
        type='confirmation'
        onPressOk={() => {
          if (fieldsMissingCheck() == 'Account Created.') {
            setModalVisible(false)
            navigation.navigate(Constants.screen.LoginScreen)
            setFullName('');
            setEmail('');
            setPhone('');
            setGender('');
            setAddress('');
            setStatePicker(0);
            setCity(0);
            setPassword('');
            setConfirmPassword('');
            setIsFieldEmpty(false);
          }
          else {
            setModalVisible(false)
            setIsFieldEmpty(true)
          }
        }}
        message={fieldsMissingCheck()}
        imageSource={fieldsMissingCheck() == 'Some fields are missing.' ? require('../../assets/warning.png') : require('../../assets/checked.png')}
        buttonText='Ok'
      />

      <CustomModal
        isVisible={errorModal}
        type='confirmation'
        onPressOk={() => setErrorModal(false)}
        message={errorMessage == '' ? 'Something went wrong.' : errorMessage}
        imageSource={require('../../assets/warning.png')}
        buttonText='Ok'
      />

      <StatusBar backgroundColor={colors.primaryColor} />
      <ImageBackground
        source={require('../../assets/blurBg.png')}
        resizeMode='cover'
        style={imageSelection == true ? {
          ...styles.bg, height: Dimensions.get('screen').height + 700
        } : styles.bg
        }
      >
        <HeaderImage />
        <FixedContainer>
          <View style={{ marginBottom: 12, flex: 1, flexDirection: 'row', marginTop: 25 }}>
            <View style={{ flex: 1 }}>
              <Logo />
            </View>

            <LanguagePicker />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.loginFieldContainer}>
              <View style={styles.credentialHeadings}>
                <TouchableOpacity
                  style={{ ...styles.activeContainer, backgroundColor: colors.primaryColorLight, borderBottomRightRadius: 15, borderTopLeftRadius: 10 }}
                  onPress={() => navigation.navigate(Constants.screen.LoginScreen)}>
                  <Text style={styles.loginText}>{LocalStrings.login}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.activeContainer}
                  onPress={() => navigation.navigate(Constants.screen.RegisterScreen)}
                >
                  <View>
                    <Text style={styles.loginText}>{LocalStrings.createAccount}</Text>
                    <View style={{ height: 2, backgroundColor: colors.buttonColor, borderRadius: 5 }} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Divider />
                <View style={styles.registerSwitchContainer}>
                  <TouchableOpacity
                    style={{ ...styles.registerType, backgroundColor: register == false ? colors.yellow : '#E5DDDD' }}
                    onPress={() => setRegister(false)}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{LocalStrings.employee}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ ...styles.registerType, backgroundColor: register == true ? colors.yellow : '#E5DDDD' }}
                    onPress={() => setRegister(true)}
                  >
                    <Text style={{ fontWeight: 'bold' }}>{LocalStrings.employer}</Text>
                  </TouchableOpacity>

                </View>

                <Text style={styles.welcomeText}>{LocalStrings.welcome}</Text>
                <Text style={{ fontSize: 12, color: colors.gray, fontWeight: '700' }}>{LocalStrings.pTime}</Text>

                <Text style={{ marginTop: 10, color: colors.primaryColor, fontWeight: 'bold' }}>{LocalStrings.choosepicture}</Text>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>

                  <ProfilePicture
                    emptyContainerStyle={{ borderColor: colors.gray }}
                    iconSize={30}
                    onPress={() => {
                      setImageSelection(!imageSelection)
                    }}
                    imageSource={imageUrl != '' ? imageUrl : undefined}
                    imageStyle={styles.profileImage}
                  />

                  {
                    imageSelection == true &&
                    <View style={{ backgroundColor: colors.white, flexDirection: 'row', paddingVertical: 7, marginTop: 3, width: 140, borderRadius: 10, justifyContent: 'space-around' }}>

                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          style={{ backgroundColor: colors.primaryColor, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                          onPress={() => camera()}
                        >
                          <Entypo name='camera' size={20} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 12, color: colors.darkGray }}>{LocalStrings.camera}</Text>
                      </View>

                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          style={{ backgroundColor: colors.buttonColor, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                          onPress={() => pickFromGallery()}
                        >
                          <Ionicons name='image-sharp' size={20} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 12, color: colors.darkGray }}>{LocalStrings.gallery}</Text>
                      </View>

                    </View>
                  }
                </View>

                <InputField
                  textStyle={{ color: isFieldEmpty == true && fullName == '' ? 'red' : colors.primaryColor }}
                  title={register == false ? LocalStrings.fName : `${LocalStrings.fName} / ${LocalStrings.bName}`}
                  placeholder={register == false ? LocalStrings.enterName : `${LocalStrings.enterName} / ${LocalStrings.bName}`}
                  maxLength={30}
                  iconName='person'
                  value={fullName}
                  onChangeText={setFullName}
                />

                <InputField
                  textStyle={{ color: isFieldEmpty == true && email == '' ? 'red' : colors.primaryColor }}
                  title={LocalStrings.email}
                  placeholder={LocalStrings.emailAddress}
                  iconName='mail'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val)
                    credentialFields.email = val
                    dispatch(saveUserCredential(credentialFields))
                  }}
                  onSubmitEditing={() => {
                    if (email != '') {
                      if (ValidateEmail(email) == false) {
                        setValidEmail(false)
                      }
                      else {
                        setValidEmail(true)
                      }
                    }
                  }}
                />

                {validEmail == false && <Text style={{ marginLeft: 7, fontWeight: 'bold', color: 'red' }}>{LocalStrings.invalidEmail}</Text>}

                <InputField
                  textStyle={{ color: isFieldEmpty == true && phone == '' ? 'red' : colors.primaryColor }}
                  title={LocalStrings.phone}
                  placeholder='Phone Number'
                  keyboardType='phone-pad'
                  maxLength={12}
                  iconName='phone-portrait'
                  value={phone == '' ? '+1' + phone : phone}
                  onChangeText={setPhone}
                />

                {
                  register == false ?

                    <View style={{ marginTop: 10 }}>
                      {show && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={date}
                          mode={mode}
                          maximumDate={date}
                          is24Hour={true}
                          display='default'
                          onChange={onChange}
                        />
                      )}
                      <Text style={{ marginLeft: 7, color: colors.primaryColor, fontWeight: '700' }}>{LocalStrings.dob}</Text>

                      <View style={styles.calendarField}>

                        <Entypo
                          name='calendar'
                          size={18}
                          color={colors.gray}
                          style={{ marginLeft: 10 }}
                        />
                        <TouchableOpacity
                          style={{ marginLeft: 5, flex: 1, height: '100%', justifyContent: 'center' }}
                          onPress={() => showDatepicker()}
                        >
                          <Text>{DateFormat(date)}</Text>

                        </TouchableOpacity>

                      </View>

                    </View>
                    : null}

                {
                  register == false && (
                    <CustomPicker
                      pickerTitleStyle={{ color: isFieldEmpty == true && gender == 0 ? 'red' : colors.primaryColor }}
                      pickerTitle={LocalStrings.gender}
                      label='Select Gender'
                      pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
                      selectedValue={gender}
                      onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                    >
                      <Picker.Item style={{ fontSize: 14 }} label={'Male'} value={'male'} />
                      <Picker.Item style={{ fontSize: 14 }} label={'Female'} value={'female'} />
                      <Picker.Item style={{ fontSize: 14 }} label={'Other'} value={'other'} />
                    </CustomPicker>
                  )
                }

                <InputField
                  textStyle={{ color: isFieldEmpty == true && address == '' ? 'red' : colors.primaryColor }}
                  inputFieldStyle={address.length > 35 && { height: Dimensions.get('window').height * 0.078 }}
                  title={LocalStrings.address}
                  placeholder='Your Full Address'
                  iconName='location-sharp'
                  maxLength={50}
                  multiline={address.length > 35 ? true : false}
                  value={address}
                  onChangeText={setAddress}
                />
                {/* <View style={styles.GooglePlace}> */}
                {/* <GooglePlacesAutocomplete
                  placeholder='Your Full Address'
                  minLength={2}
                  autoFocus={false}
                  returnKeyType={'default'}
                  fetchDetails={true}
                  styles={{
                   
                    textInput: {
                      marginTop: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 15,
                      borderColor: 'gray',
                      borderWidth: 1.5,
                      height: Dimensions.get('window').height * 0.065
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                  }}
                  query={{
                    key: 'AIzaSyAG8XBFKHqkH3iKweO_y3iC6kYvcwdsKxY',
                    language: 'en',
                  }}
                /> */}
                {/* </View> */}
                <StatePicker
                  pickerTitleStyle={{ color: isFieldEmpty == true && statePicker == 0 ? 'red' : colors.primaryColor }}
                  pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
                  items={cityStates}
                  selectedValue={statePicker}
                  onValueChange={(itemValue, itemIndex) => {
                    setStatePicker(itemValue)
                  }}
                />

                <CustomPicker
                  pickerTitleStyle={{ color: isFieldEmpty == true && city == 0 ? 'red' : colors.primaryColor }}
                  pickerTitle={LocalStrings.city}
                  label='Select City'
                  pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
                  selectedValue={city}
                  onValueChange={(itemValue, itemIndex) => {
                    setCity(itemValue)
                  }}
                >
                  {
                    cities.length > 0 ?
                      cityItems.map((val, index) => (
                        <Picker.Item
                          style={{ fontSize: 14 }}
                          key={index}
                          label={val.city}
                          value={val.city}
                        />
                      ))
                      : null
                  }
                </CustomPicker>

                <InputField
                  textStyle={{ color: isFieldEmpty == true && zipCode == '' ? 'red' : colors.primaryColor }}
                  title={LocalStrings.zipCode}
                  placeholder='Zip Code'
                  maxLength={5}
                  keyboardType='number-pad'
                  value={zipCode}
                  onChangeText={setZipCode}
                />

                <PasswordField
                  titleStyle={{ color: isFieldEmpty == true && password == '' ? 'red' : colors.primaryColor }}
                  title={LocalStrings.setPass}
                  placeholder='Set Password'
                  secureTextEntry={eye ? true : false}
                  iconName={eye ? 'eye-off' : 'eye'}
                  onPress={() => setEye(!eye)}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val)
                    credentialFields.password = val
                    dispatch(saveUserCredential(credentialFields))
                  }}
                />


                <PasswordField
                  titleStyle={{ color: isFieldEmpty == true && confirmPassword == '' ? 'red' : colors.primaryColor }}
                  title={LocalStrings.confirmPass}
                  placeholder='Confirm Password'
                  secureTextEntry={confirmEye ? true : false}
                  iconName={confirmEye ? 'eye-off' : 'eye'}
                  onPress={() => setConfirmEye(!confirmEye)}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <RememberMe
                  style={{ marginTop: 7 }}
                  iconName={onClickRememberMe == false ? 'crop-square' : 'check-box'}
                  onPress={() => setOnClickRememberMe(!onClickRememberMe)}
                />

                <Button
                  title={LocalStrings.createAccount}
                  style={{ marginTop: 8 }}
                  onPress={() => {
                    if (register == true) {
                      if (fullName != '' && email != '' && phone != '' && address != '' && statePicker != 0 && city != 0 && zipCode != '' && password != '' && confirmPassword != '') {
                        registerUser()
                      }
                      else {
                        setModalVisible(!modalVisible)
                      }
                    }
                    else if (register == false) {
                      if (fullName != '' && email != '' && phone != '' && imageUrl != '' && gender != 0 && address != '' && statePicker != 0 && city != 0 && zipCode != '' && password != '' && confirmPassword != '') {
                        registerUser()
                      }
                      else {
                        setModalVisible(!modalVisible)
                      }
                    }
                  }}
                />

                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'center' }}>

                  <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 12 }}>{LocalStrings.already}</Text>

                  <TouchableOpacity onPress={() => navigation.navigate(Constants.screen.LoginScreen)}>
                    <Text style={{ marginLeft: 10, textDecorationLine: 'underline', color: colors.buttonColor, fontWeight: 'bold', fontSize: 12 }}>{LocalStrings.login}</Text>
                  </TouchableOpacity>

                </View>

                <Divider style={{ marginTop: 10 }} />

                <CompanyLabel style={{ marginTop: 10 }} />

              </View>

            </View>

          </View>

        </FixedContainer>

      </ImageBackground>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bg: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height + 680,
  },
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  loginFieldContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    width: Dimensions.get('window').width * 0.9
  },
  credentialHeadings: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Dimensions.get('window').height * 0.085
  },
  loginText: {
    color: colors.buttonColor,
    fontSize: 16,
    fontWeight: 'bold'
  },
  otpText: {
    color: colors.buttonColor,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  activeContainer: {
    flex: 0.5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  iconImage: {
    height: 20,
    width: 30
  },
  calendarField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    height: Dimensions.get('window').height * 0.065,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gray
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    // alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 20,
    // height: 180,
    width: '90%',
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  registerSwitchContainer: {
    marginTop: 10,
    width: '70%',
    height: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E5DDDD',
    borderRadius: 20
  },
  registerType: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 20,
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.gray
  },
  Btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height * 0.06,
    width: '40%',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  BtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  GooglePlace: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1.5,
    height: Dimensions.get('window').height * 0.065
  },
});

export default RegisterScreen;