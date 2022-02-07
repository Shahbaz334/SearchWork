import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, ImageBackground, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Heading from '../../Components/atoms/Haeding';
import HeaderImage from '../../Components/atoms/HeaderImage';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ProfilePicture from '../../Components/atoms/ProfilePicture';
import Button from '../../Components/molecules/Button';
import Description from '../../Components/molecules/Description';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import ProfileTextField from '../../Components/molecules/ProfileTextField';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { userLogin, loginUserProfile, getLoggedInProfile,setLanguageSelected } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import ErrorModal from '../../Components/organisms/ErrorModal';
import Loader from '../../Components/atoms/Loader';
import CustomModal from '../../Components/organisms/CustomModal';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { strings } from '../../Language/i18n';
import LocalStrings from '../../Language/Strings'
import AsyncStorage from '@react-native-community/async-storage';


const EmployerProfile = ({ navigation }) => {

  let selectedLang = useSelector(setLanguageSelected)

  const userProfile = useSelector(loginUserProfile);
  console.log('User Profile Data:', userProfile)

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [emailAddress, setEmailAddress] = useState(userProfile?.email)
  const [contactNo, setContactNo] = useState(userProfile?.phone)
  const [businessName, setBusinessName] = useState(userProfile?.name)
  const [address, setAddress] = useState(userProfile?.address)
  const [state, setState] = useState(userProfile?.state)
  const [city, setCity] = useState(userProfile?.city)
  const [zipCode, setZipCode] = useState(userProfile?.zipcode.toString())
  const [editFields, setEditFields] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false)
  const [accountStatusModal, setAccountStatusModal] = useState(false);
  const [pause, setPause] = useState('');

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      accountStatus()
    }
  }, [isFocused])

  async function accountStatus() {
    let status = await AsyncStorage.getItem("PauseBit")
    console.log("Account Status....", status)
    setPause(status)
    if (status == '0') {
      setAccountStatusModal(true)
    }
  }


  function profileImage() {
    if (imageUrl == '') {
      if (userProfile?.image_urls != undefined) {
        return userProfile?.image_urls['3x']
      }
    }
    else {
      return imageUrl
    }
  }

  const pickFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
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
      }
    })
  }

  var bodyFormData = new FormData();

  businessName != '' && bodyFormData.append('name', businessName)
  contactNo != '' && bodyFormData.append('phone', contactNo)
  imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'profile_picture', type: 'image/*' })
  address != '' && bodyFormData.append('address', address)
  state != '' && bodyFormData.append('state', state)
  city != '' && bodyFormData.append('city', city)



  async function updateProfile() {
    setLoader(true)

    try {
      var response = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.UpdateProfile,
        bodyFormData
      );

      if (response.isAxiosError == true) {
        setModalMessage(response.response.data.error.messages.map(val => val + '\n'))
        setModalVisible(true)
        setLoader(false)
      }
      else {
        setModalMessage('Profile has been successfully updated')
        setModalVisible(true)
        setLoader(false)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
      setLoader(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function getUserProfile() {
        setLoader(true)

        if (userProfile != undefined) {
          setLoader(false)
        }

        try {
          var response = await apiCall(
            ApiConstants.methods.GET,
            ApiConstants.endPoints.LoggedInUserProfile,
          );

          if (response.isAxiosError == true) {
            setErrorMessage(response.response.data.error.messages.map(val => val + '\n'))
            setErrorModal(true)
            setLoader(false)
          }
          else {
            dispatch(getLoggedInProfile(response.data.response.data))
            setLoader(false)
          }
        }
        catch (error) {
          console.log('Catch Body:', error);
          setLoader(false)
        }
      }
      getUserProfile();
    }, [])
  )

  if (loader == true) {
    return (
      <Loader />
    )
  }



  return (
    <ScrollView
      style={{ backgroundColor: colors.white, flex: 1 }}
      showsVerticalScrollIndicator={false}
      screenProps={{selectedLang}}
    >

      <StatusBar backgroundColor={colors.primaryColor} />
      <ErrorModal
        isVisible={accountStatusModal}
        message={'Your account is paused. Un-pause it to continue...'}
        onPress={() => {
          setAccountStatusModal(false),
            setTimeout(() => {
              navigation.goBack()
            }, 500);
        }}
      />
      <CustomModal
        type='confirmation'
        message={modalMessage}
        imageSource={modalMessage != 'Profile has been successfully updated' ? require('../../../assets/warning.png') : require('../../../assets/checked.png')}
        isVisible={modalVisible}
        onPressOk={() => setModalVisible(false)}
      />

      <ErrorModal
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <HeaderImage style={{ height: Dimensions.get('window').height * 0.21 }} />

      <HeaderRowContainer>
        <MenuIcon onPress={() => navigation.openDrawer()} />

        <View style={{ alignItems: 'center' }}>

          <ProfilePicture
            disabled={editFields == true ? false : true}
            iconSize={40}
            onPress={() => pickFromGallery()}
            imageSource={profileImage()}
            imageStyle={styles.profileImage}
          />

          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>{userProfile?.name}</Text>
        </View>

        <LanguagePicker
          viewStyle={{ width: 80 }}
          containerStyle={{ flex: 1 }}
          value={lang}
          setValue={setLang}
          open={dropDown}
          setOpen={setDropDown}
        />

      </HeaderRowContainer>

      <View style={styles.infoContainer}>

        <Heading title={LocalStrings.BUSINESS_INFORMATION} style={{ marginTop: 5 }} />

        <ProfileTextField
          title={LocalStrings.BUSINESS_NAME}
          maxLength={30}
          multiline={true}
          value={businessName}
          onChangeText={setBusinessName}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.CONTACT_NO}
          value={contactNo}
          onChangeText={setContactNo}
          keyboardType='phone-pad'
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.Email}
          multiline={true}
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType='email-address'
          editable={false}
        />

        <Heading title={LocalStrings.BUSINESS_LOCATION} style={{ marginTop: 16 }} />

        <ProfileTextField
          title={LocalStrings.ADDRESS}
          multiline={true}
          value={address}
          onChangeText={setAddress}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.state}
          value={state}
          onChangeText={setState}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.CITY}
          value={city}
          onChangeText={setCity}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.ZIP_CODE}
          value={zipCode}
          onChangeText={setZipCode}
          editable={editFields}
        />

      </View>

      <View style={{ height: 100 }}>
        <View style={{ flexDirection: 'row', marginTop: 'auto' }}>
          <Button
            title={LocalStrings.Edit_Profile}
            style={styles.button}
            onPress={() => setEditFields(true)}
          />

          <Button
            title={LocalStrings.Saved}
            style={{ ...styles.button, borderTopRightRadius: 30, borderTopLeftRadius: 0, backgroundColor: colors.primaryColor }}
            onPress={() => {
              updateProfile()
              setEditFields(false)
            }}
          />
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    paddingVertical: 9,
    paddingHorizontal: 9
  },
  button: {
    flex: 1,
    height: Dimensions.get('window').height * 0.093,
    borderTopLeftRadius: 30,
    borderRadius: 0
  },
  userImageContainer: {
    backgroundColor: colors.lightGray,
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.white
  }
});

export default EmployerProfile;