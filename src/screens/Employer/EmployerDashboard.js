import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import { PermissionsAndroid, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CompanyLabelCard from '../../Components/atoms/CompanyLabelCard';
import Divider from '../../Components/atoms/Divider';
import EmployerLogo from '../../Components/atoms/EmployerLogo';
import Loader from '../../Components/atoms/Loader';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ProfilePicture from '../../Components/atoms/ProfilePicture';
import BgCard from '../../Components/molecules/BgCard';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import ErrorModal from '../../Components/organisms/ErrorModal';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { getJobCategory, getLoggedInProfile, jobsCategoryList, loginUserProfile, setLanguageSelected } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import { strings, ChangeLanguage } from '../../Language/i18n'
import LocalStrings from '../../Language/Strings'
import AsyncStorage from "@react-native-community/async-storage"


const EmployerDashboard = ({ navigation }) => {
  let selectedLang = useSelector(setLanguageSelected)

  // useEffect(async () => {
  //   let Token = await AsyncStorage.getItem("Auth_Token")
  //   // setToken(Token)
  //   console.log("From Storage",Token)
  // },[])

  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [token, setToken] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const dispatch = useDispatch();

  const categoryList = useSelector(jobsCategoryList);
  const userProfile = useSelector(loginUserProfile);
  // const Token = useSelector(authToken)
  // console.log("Profile Data From Redux.......................", userProfile)

  // useEffect(async () => {
  //   let language = await AsyncStorage.getItem('language');
  //   console.log("lan", language)

  // }, [])

  useFocusEffect(
    useCallback(() => {
      async function getJobsCategory() {
        setLoader(true)

        if (categoryList != undefined) {
          setLoader(false)
        }

        try {
          var response = await apiCall(
            ApiConstants.methods.GET,
            ApiConstants.endPoints.JobsCategory,

          );

          if (response.isAxiosError == true) {
            console.log('Job Category Axios Error')
            setLoader(false)
          }
          else {
            console.log("Jobs------------------ ", response.data.response.data)
            dispatch(getJobCategory(response.data.response.data))
            setLoader(false)
          }
        }
        catch (error) {
          console.log('Catch Body:', error);
          setLoader(false)
        }
      }

      async function getUserProfile() {
        setLoader(true)

        // if(userProfile != undefined){
        //   setLoader(false)
        // }

        try {
          var response = await apiCall(
            ApiConstants.methods.GET,
            ApiConstants.endPoints.LoggedInUserProfile,
          );

          if (response.isAxiosError == true) {
            // console.log("Profile Data...........", response.data.response.data)
            setErrorMessage(response.response.data.error.messages.map(val => val + '\n'))
            setErrorModal(true)
            setLoader(false)
          }
          else {
            // console.log("Profile Data...........", response.data.response.data)
            dispatch(getLoggedInProfile(response.data.response.data))
            setLoader(false)
          }
        }
        catch (error) {
          console.log('Catch Body:', error);
          setLoader(false)
        }
      }
      // ----------------------Location Permission-----------------------
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'SearchWork',
              'message': 'SearchWork wants to access to your location '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location")
            // alert("You can use the location");
          } else {
            console.log("location permission denied")
            alert("Location permission denied");
          }
        } catch (err) {
          console.warn(err)
        }
      }

      // -------------------------Current LatLong---------------------------


      requestLocationPermission()
      getJobsCategory();
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
    screenProps={{selectedLang}}
    style={{ backgroundColor: colors.white, flex: 1 }} showsVerticalScrollIndicator={false}>

      <StatusBar backgroundColor={colors.primaryColor} />

      <ErrorModal
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <View style={styles.headerContainer}>

        <HeaderRowContainer>

          <View>
            <MenuIcon iconColor={colors.darkGray} onPress={() => navigation.openDrawer()} />
            <EmployerLogo />
          </View>

          <LanguagePicker
            viewStyle={{ width: 75 }}
            containerStyle={{ flex: 1 }}
            value={lang}
            setValue={setLang}
            open={dropDown}
            setOpen={setDropDown}
          />

        </HeaderRowContainer>

      </View>

      <Image source={require('../../../assets/bgSlide.jpg')} style={styles.image} />

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={{ position: 'absolute', bottom: -35 }}>
          <ProfilePicture
            emptyContainerStyle={styles.profilePicture}
            imageStyle={{ ...styles.profilePicture, borderWidth: 2 }}
            iconSize={50}
            imageSource={userProfile?.image_urls != undefined && userProfile?.image_urls['3x']}
            disabled={true}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 15 }}>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.darkGray, fontSize: 22, fontWeight: 'bold' }}>{LocalStrings.Welcome}</Text>
          <Text style={{ color: colors.primaryColor, fontSize: 22, fontWeight: 'bold', flexWrap: 'wrap' }}>{userProfile?.name}</Text>
        </View>

        {/* <TouchableOpacity onPress={() => ChangeLanguage("en")}> */}
        <Text style={{ color: colors.darkGray, fontWeight: 'bold', fontSize: 13 }}>{LocalStrings.welcome}</Text>
        {/* </TouchableOpacity> */}
      </View>

      <View style={{ padding: 15 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Text style={{ fontWeight: 'bold', color: colors.darkGray }}>{LocalStrings.dashboard}</Text>
          <Divider style={{ flex: 1, marginLeft: 5 }} />
        </View>

        <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>

          <BgCard
            bgImage={require('../../../assets/red.png')}
            iconImage={require('../../../assets/edit.png')}
            title={LocalStrings.PostJob}
            onPress={() => navigation.navigate(Constants.screen.JobPosted,)}
          />

          <BgCard
            bgImage={require('../../../assets/green.png')}
            iconImage={require('../../../assets/search.png')}
            title={LocalStrings.MyJobs}
            onPress={() => navigation.navigate(Constants.screen.JobPostedList)}
          />

          <BgCard
            style={{ marginTop: 10 }}
            bgImage={require('../../../assets/blue.png')}
            iconImage={require('../../../assets/applicants.png')}
            title={LocalStrings.ViewApplications}
            onPress={() => navigation.navigate(Constants.screen.AppliedJobsList)}
          />

          <BgCard
            style={{ marginTop: 10 }}
            bgImage={require('../../../assets/purple.png')}
            iconImage={require('../../../assets/profile.png')}
            title={LocalStrings.ManageProfile}
            onPress={() => navigation.navigate(Constants.screen.EmployerProfile)}
          />

        </View>

      </View>

      <CompanyLabelCard />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    height: Dimensions.get('window').height * 0.22,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderColor: 'green',
    borderWidth: 1.5,
    elevation: 20
  },
  profilePicture: {
    borderColor: colors.primaryColor,
    height: 120,
    width: 120,
    borderRadius: 60
  },
  image: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: 220,
  },
});

export default EmployerDashboard;