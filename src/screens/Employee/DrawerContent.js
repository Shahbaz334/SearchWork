import React, { useState,useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView,Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CompanyLabel from '../../Components/atoms/CompanyLabel';
import HeaderImage from '../../Components/atoms/HeaderImage';
import Logo from '../../Components/atoms/Logo';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ProfilePicture from '../../Components/atoms/ProfilePicture';
import IconButton from '../../Components/molecules/IconButton';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { jobPostedSelector, login, setJobPost, saveUserCredential, userCredential, getLoggedInProfile,setLanguageSelected } from '../../redux/slices';
import { userLogin, loginUserProfile } from '../../redux/slices';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import { strings } from '../../Language/i18n';
import LocalStrings from '../../Language/Strings'
import AsyncStorage from '@react-native-community/async-storage';

const DrawerContent = ({ navigation }) => {
  const [userId, setUserId] = useState('')
  const [pause, setPause] = useState('1')
  const [loader, setLoader] = useState(false)
  const jobFields = useSelector(jobPostedSelector);
  const credentials = useSelector(userCredential);
  var credentialFields = { ...credentials }
  var jobObj = { ...jobFields }
 // const userProfile = useSelector(loginUserProfile)
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

  let selectedLang = useSelector(setLanguageSelected)
  
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
    bodyFormData.append('id', userProfile.id)
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
  

  const userProfile = useSelector(loginUserProfile)
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>

      <HeaderImage style={{ height: Dimensions.get('window').height * 0.28 }} />

      <View style={{ position: 'absolute', width: '100%', padding: 15 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Logo />

          <MenuIcon onPress={() => navigation.closeDrawer()} />

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

          <View style={{ marginRight: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.white, fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: 'bold' }}>{userProfile?.name}</Text>
          </View>


          <ProfilePicture
            iconSize={40}
            emptyContainerStyle={styles.profilePicture}
            imageStyle={{ ...styles.profilePicture, borderWidth: 2 }}
            imageSource={userProfile?.image_urls != undefined && userProfile?.image_urls['3x']}
            disabled={true}
          />

        </View>

      </View>

      <ScrollView style={{ marginLeft: 20, marginBottom: 15 }}>

        <IconButton title={LocalStrings.Home} onPress={() => navigation.navigate(Constants.screen.EmployeeDashboard)} style={styles.IconButtonContainer}>
          <Entypo name='home' size={30} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.Jobs} onPress={() => navigation.navigate(Constants.screen.AllJobsScreen)} style={styles.IconButtonContainer}>
          <Ionicons name='briefcase' size={30} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.SavedJobs} style={styles.IconButtonContainer} onPress={() => navigation.navigate(Constants.screen.SavedJobs)}>
          <FontAwesome name='bookmark' size={30} color={colors.primaryColor} />
        </IconButton>
       

        <IconButton title={LocalStrings.Profile} style={styles.IconButtonContainer} onPress={() => navigation.navigate(Constants.screen.EmployeeProfile)}>
          <FontAwesome name='user' size={30} color={colors.primaryColor} />
        </IconButton>

        <IconButton title={LocalStrings.ChangePassword} style={styles.IconButtonContainer} onPress={() => navigation.navigate(Constants.screen.ChangePassword)}>
          <Ionicons name='lock-closed' size={30} color={colors.primaryColor} />
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




        <IconButton
          title={LocalStrings.Logout}
          style={styles.IconButtonContainer}
          onPress={() => {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: Constants.screen.LoginScreen }] }));
            dispatch(login(null))
          }}
        >
          <Entypo name='login' size={30} color={colors.primaryColor} />
        </IconButton>


      </ScrollView>

      <View style={styles.bottomContainer}>

        <CompanyLabel style={{ color: colors.white, alignSelf: 'flex-start', marginLeft: 15 }} />

        <View style={{ marginRight: 15 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Entypo name='facebook' size={20} color={colors.white} />
            <AntDesign name='instagram' size={20} color={colors.white} />
            <Entypo name='twitter' size={20} color={colors.white} />
          </View>

          <Text style={{ fontWeight: 'bold', color: colors.white }}>SearchWork</Text>

        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  searchFieldConatiner: {
    paddingHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    borderRadius: 20,
    backgroundColor: colors.primaryColorLight
  },
  categoriesContainer: {
    height: 60,
    //backgroundColor: 'gray',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  bottomContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:
      colors.primaryColor,
    height: Dimensions.get('window').height * 0.14,
    borderBottomRightRadius: 40
  },
  IconButtonContainer: {
    height: 65
  },
  profilePicture: {
    borderColor: colors.white,
    height: 80,
    width: 80,
    borderRadius: 40
  },
});

export default DrawerContent;