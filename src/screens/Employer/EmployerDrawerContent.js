import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Linking, Text, TouchableOpacity, View, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import CompanyLabel from '../../Components/atoms/CompanyLabel';
import EmployerLogo from '../../Components/atoms/EmployerLogo';
import Loader from '../../Components/atoms/Loader';
import MenuIcon from '../../Components/atoms/MenuIcon';
import IconButton from '../../Components/molecules/IconButton';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import { apiCall } from '../../service/ApiCall';
import Constants from '../../Constants/Constants.json';
import ApiConstants from '../../service/ApiConstants.json';
import { jobPostedSelector, login, setJobPost, saveUserCredential, userCredential, getLoggedInProfile,setLanguageSelected } from '../../redux/slices';
import { strings } from '../../Language/i18n'
import LocalStrings from '../../Language/Strings'
import AsyncStorage from '@react-native-community/async-storage';
import Payment_Screen from '../Payment_Screen';

const EmployerDrawerContent = ({ navigation }) => {

  let selectedLang = useSelector(setLanguageSelected)


  useEffect(async () => {
    let userId = await AsyncStorage.getItem("userId")
    console.log("User Id: ", userId)
    setUserId(userId)
    let Bit = await AsyncStorage.getItem("PauseBit")
    console.log("Bit : ", Bit)
    if (Bit) {
      setPause(Bit)
    }
  }, [])


  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [loader, setLoader] = useState(false)
  const [userId, setUserId] = useState('')
  const [pause, setPause] = useState('1')
  const jobFields = useSelector(jobPostedSelector);
  const credentials = useSelector(userCredential);
  var credentialFields = { ...credentials }
  //console.log(jobFields);

  var jobObj = { ...jobFields }

  const dispatch = useDispatch();
  var bodyFormData = new FormData();
  bodyFormData.append('id', userId)

  async function deleteUser() {

    console.log("In Delete Function......")
    try {
      setLoader(true)
      var apiResponse = await apiCall
        (ApiConstants.methods.POST,
          ApiConstants.endPoints.deleteUser,
          bodyFormData,
          // token
        )

      if (apiResponse.isAxiosError == true) {
        // setErrorModal(true)
        // setErrorMessage(apiResponse.response.data.error.messages.map(val => val + '\n'))
        setLoader(false);
        credentialFields.password = ''
        credentialFields.email = ''
        dispatch(saveUserCredential(credentialFields))
      }

      else {
        credentialFields.password = ''
        credentialFields.email = ''
        dispatch(saveUserCredential(credentialFields))

        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.LoginScreen }] }));
        AsyncStorage.removeItem("userId")
        dispatch(login(null))
        dispatch(getLoggedInProfile(null))
        jobObj.jobTitle = ''
        jobObj.hourlyPay = ''
        jobObj.duration = 0
        jobObj.jobCategory = 0
        jobObj.jobSubCategory = 0
        jobObj.jobDescription = ''
        jobObj.noOfEmployees = 0
        jobObj.state = 0
        jobObj.city = 0
        jobObj.zipCode = ''
        jobObj.address = ''
        dispatch(setJobPost(jobObj))
        setLoader(false)
      }
    }
    catch (error) {
      console.log('Catch Body:', error)
      setLoader(false)
    }
  }

  async function pause_Unpause_User() {

    var bodyFormData = new FormData();
    bodyFormData.append('id', userId)
    if (pause == '1') {
      bodyFormData.append('pause', '1')
    } else {
      bodyFormData.append('pause', '0')
    }

    console.log("In Pause Function......")
    try {
      setLoader(true)
      var apiResponse = await apiCall
        (ApiConstants.methods.POST,
          ApiConstants.endPoints.pauseUser,
          bodyFormData,
          // token
        )

      if (apiResponse.isAxiosError == true) {
        // setErrorModal(true)
        // setErrorMessage(apiResponse.response.data.error.messages.map(val => val + '\n'))
        setLoader(false);
      }

      else {
        setLoader(false);
        setPause(pause == '1' ? '0' : '1')
         await AsyncStorage.setItem("PauseBit", pause == '1' ? '0' : '1')
        // console.log(apiResponse.data.response.pause)
        // console.log("After: ",pause)
        console.log("Pause Api Response: ", apiResponse.data)
        Alert.alert("Alert!", pause == '1' ? "Your account is paused" : "Your account is live")
      }
    }
    catch (error) {
      console.log('Catch Body:', error)
      setLoader(false)
    }
  }

  if (loader == true) {
    return (
      <Loader />
    )
  }

  return (
    <View style={{ flex: 1 }}
    screenProps={{selectedLang}}
    >

      <View style={styles.headerContainer}>

        <View style={{ position: 'absolute', width: '100%', padding: 9 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <View>
              <MenuIcon iconColor={colors.darkGray} onPress={() => navigation.closeDrawer()} />
              <EmployerLogo />
            </View>

            <LanguagePicker
              viewStyle={{ width: 80 }}
              containerStyle={{ flex: 1 }}
              value={lang}
              setValue={setLang}
              open={dropDown}
              setOpen={setDropDown}
            />

          </View>

        </View>

      </View>

      <ScrollView style={{ marginLeft: 20, }}>

        <IconButton title={LocalStrings.Home} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.EmployerDashboard)}>
          <Entypo name='home' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.PostJob} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.JobPosted)}>
          <MaterialCommunityIcons name='file-document-edit' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.Draft} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.Draft)}>
          <MaterialIcons name='drafts' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.Subscription} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.Payment_Screen)}>
          <FontAwesome5 name='money-check-alt' size={22} color={colors.primaryColor} />
        </IconButton>
        


        <IconButton title={LocalStrings.MyJobs} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.JobPostedList)}>
          <MaterialCommunityIcons name='text-box-search' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.Applicants} style={styles.iconButton}
          onPress={() => navigation.navigate(Constants.screen.AppliedJobsList)}
        >
          <FontAwesome name='users' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.ChangePassword} style={styles.iconButton} onPress={() => navigation.navigate(Constants.screen.ChangePassword)}>
          <Ionicons name='lock-closed' size={22} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.DeleteAccount} style={styles.iconButton}
          onPress={() => {
            Alert.alert(
              "Delete Post",
              "Are you sure you want to delete your account?",
              [
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "Yes", onPress: () => deleteUser() }
              ]
            );
          }}
        >
          <MaterialCommunityIcons name='delete' size={22} color={colors.primaryColor} />
        </IconButton>
        <IconButton title={pause == '1' ? LocalStrings.PauseAccount : LocalStrings.UnPauseAccount} style={styles.iconButton} onPress={() => {
          pause_Unpause_User()
        }}>
          <MaterialCommunityIcons name='pause-circle' size={22} color={colors.primaryColor} />
        </IconButton>

        <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>

          <MaterialCommunityIcons name='logout' size={22} color={colors.primaryColor} style={{ marginLeft: 3 }} />
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.LoginScreen }] }));
              dispatch(login(null))
              dispatch(getLoggedInProfile(null))
              jobObj.jobTitle = ''
              jobObj.hourlyPay = ''
              jobObj.duration = 0
              jobObj.jobCategory = 0
              jobObj.jobSubCategory = 0
              jobObj.jobDescription = ''
              jobObj.noOfEmployees = 0
              jobObj.state = 0
              jobObj.city = 0
              jobObj.zipCode = ''
              jobObj.address = ''
              dispatch(setJobPost(jobObj))
            }}
          >
            <Text style={{ fontSize: 22 }}>{LocalStrings.Logout}</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>

        <CompanyLabel
          style={{ color: colors.white, alignSelf: 'flex-start', marginLeft: 15 }}
        />

        <View style={{ marginRight: 15 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Entypo name='facebook' size={20} color={colors.white} />
            <AntDesign name='instagram' size={20} color={colors.white} />
            <Entypo name='twitter' size={20} color={colors.white} />
          </View>

          <Text style={{ fontWeight: 'bold', color: colors.white }}>{strings("SearchWork")}</Text>

        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    height: Dimensions.get('window').height * 0.22,
    //height: Dimensions.get('window').height * 0.25,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderColor: colors.primaryColor,
    borderWidth: 1.5,
    elevation: 20
  },
  iconButton: {
    height: 55
  },
  bottomContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryColor,
    height: Dimensions.get('screen').height * 0.11,
    borderBottomRightRadius: 40
  }
});

export default EmployerDrawerContent;