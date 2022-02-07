import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import Heading from '../../Components/atoms/Haeding';
import HeaderImage from '../../Components/atoms/HeaderImage';
import Loader from '../../Components/atoms/Loader';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ProfilePicture from '../../Components/atoms/ProfilePicture';
import Button from '../../Components/molecules/Button';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import ProfileTextField from '../../Components/molecules/ProfileTextField';
import CustomModal from '../../Components/organisms/CustomModal';
import ErrorModal from '../../Components/organisms/ErrorModal';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { getLoggedInProfile, loginUserProfile, userLogin } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import LocalStrings from '../../Language/Strings';


const EmployeeProfile = ({ navigation }) => {

  const user = useSelector(userLogin);
  const userProfile = useSelector(loginUserProfile);

  const [dropDown, setDropDown] = useState(false);
  const [lang, setLang] = useState('eng');
  const [loader, setLoader] = useState(false);
  const [editFields, setEditFields] = useState(false);
  const [name, setName] = useState(userProfile?.name);
  const [phone, setPhone] = useState(userProfile?.phone);
  const [gender, setGender] = useState(userProfile?.gender == 'male' ? 'Male' : 'Female');
  const [dob, setDob] = useState(userProfile?.dob);
  const [email, setEmail] = useState(userProfile?.email);
  const [language, setLanguage] = useState(userProfile?.languages);
  const [homeAddress, setHomeAddress] = useState(userProfile?.address);
  const [statePick, setStatePick] = useState(userProfile?.state);
  const [cityPick, setCityPick] = useState(userProfile?.city);
  const [zipCode, setZipCode] = useState(userProfile?.zipcode.toString());
  const [objectives, setObjectives] = useState(userProfile?.objective);
  const [jobExperience, setJobExperience] = useState(userProfile?.experience)
  const [imageUrl, setImageUrl] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [JobType, setJobType] = useState(userProfile?.JobType)


  const dispatch = useDispatch();


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
        console.log("source",source);
        setImageUrl(source)
      }
    })
  }


  var bodyFormData = new FormData();

  name != '' && bodyFormData.append('name', name)
  phone != '' && bodyFormData.append('phone', phone)
  imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'profile_picture', type: 'image/*' })
  homeAddress != '' && bodyFormData.append('address', homeAddress)
  statePick != '' && bodyFormData.append('state', statePick)
  cityPick != '' && bodyFormData.append('city', cityPick)
  language != null && bodyFormData.append('languages', language)
  jobExperience != null && bodyFormData.append('experience', jobExperience)
  objectives != null && bodyFormData.append('objective', objectives)



  async function updateProfile() {
    setLoader(true)

    try {
      var response = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.UpdateProfile,
        bodyFormData
      );

      if (response.isAxiosError == true) {
        setErrorMessage(response.response.data.error.messages.map(val => val + '\n'))
        setErrorModal(true)
        setLoader(false)
      }
      else {
        setSuccessModal(true)
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
        // setLoader(true)

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
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }} showsVerticalScrollIndicator={false}>

      <StatusBar backgroundColor={colors.primaryColor} />

      <ErrorModal
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <CustomModal
        type='confirmation'
        imageSource={require('../../../assets/checked.png')}
        isVisible={successModal}
        message={'Profile has been successfully updated.'}
        onPressOk={() => {
          setSuccessModal(false)
          navigation.navigate(Constants.screen.EmployeeDashboard)
        }}
      />

      <HeaderImage style={{ height: Dimensions.get('window').height * 0.29 }} />

      <HeaderRowContainer>
        <MenuIcon onPress={() => navigation.openDrawer()} />

        <View style={{ alignItems: 'center', width: 190, overflow: 'hidden' }}>

          <ProfilePicture
            disabled={editFields == true ? false : true}
            iconSize={40}
            emptyContainerStyle={styles.profilePicture}
            imageStyle={{ ...styles.profilePicture, borderWidth: 2 }}
            imageSource={user?.image_urls != undefined && user?.image_urls['3x']}
            onPress={() => pickFromGallery()}
            imageSource={profileImage()}
          />

          <Text numberOfLines={1} ellipsizeMode='clip' style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>
            {user?.name}
          </Text>

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

      <Text style={{ alignSelf: 'center', paddingHorizontal: 15, color: colors.white, position: 'absolute', top: 115 }}>
        {userProfile?.objective}
      </Text>

      <View style={styles.infoContainer}>

        <Heading title={LocalStrings.my_Information} />

        <ProfileTextField
          title={LocalStrings.fName}
          multiline={true}
          maxLength={30}
          value={name}
          onChangeText={setName}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.CONTACT_NO}
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.gender}
          value={gender}
          onChangeText={setGender}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.dob}
          value={dob}
          onChangeText={setDob}
          editable={editFields}
        />

        <ProfileTextField
          multiline={true}
          title={LocalStrings.email}
          value={email}
          editable={false}
        />

        <ProfileTextField
          title={LocalStrings.Language}
          multiline={true}
          value={language}
          onChangeText={setLanguage}
          editable={editFields}
        />

        <Heading title={LocalStrings.ad_Information} style={{ marginTop: 16 }} />

        <ProfileTextField
          title={LocalStrings.objective}
          multiline={true}
          maxLength={250}
          value={objectives}
          onChangeText={setObjectives}
          editable={editFields}
        />
        <Text style={styles.charactersLengthText}>
          {`${objectives?.length ? objectives.length : 0} / 250 Characters`}
        </Text>


        <ProfileTextField
          title={LocalStrings.Experience}
         
          multiline={true}
          value={jobExperience}
          onChangeText={setJobExperience}
          editable={editFields}
        />
           <ProfileTextField
          title={LocalStrings.JobType}
          placeholder="Part Time / Full Time / Both"
          multiline={true}
          value={JobType}
          onChangeText={setJobType}
          editable={editFields}
        />

        <Heading title={LocalStrings.Location} style={{ marginTop: 16 }} />

        <ProfileTextField
          title={LocalStrings.ADDRESS}
          multiline={true}
          value={homeAddress}
          onChangeText={setHomeAddress}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.state}
          value={statePick}
          onChangeText={setStatePick}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.city}
          value={cityPick}
          onChangeText={setCityPick}
          editable={editFields}
        />

        <ProfileTextField
          title={LocalStrings.ZIP_CODE}
          value={zipCode}
          onChangeText={setZipCode}
          editable={editFields}
        />

      </View>

      <View style={{ flexDirection: 'row' }}>
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

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height * 0.34,
  },
  infoContainer: {
    padding: 9
  },
  button: {
    flex: 0.5,
    height: Dimensions.get('screen').height * 0.08,
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
  profilePicture: {
    borderColor: colors.white,
    height: 80,
    width: 80,
    borderRadius: 40
  },
  charactersLengthText: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: colors.darkGray,
    fontWeight: 'bold'
  }
});

export default EmployeeProfile;