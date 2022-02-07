import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import CompanyLabelCard from '../../Components/atoms/CompanyLabelCard';
import Divider from '../../Components/atoms/Divider';
import HeaderImage from '../../Components/atoms/HeaderImage';
import IconText from '../../Components/atoms/IconText';
import Loader from '../../Components/atoms/Loader';
import Logo from '../../Components/atoms/Logo';
import MenuIcon from '../../Components/atoms/MenuIcon';
import Button from '../../Components/molecules/Button';
import CustomModal from '../../Components/organisms/CustomModal';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { jobViewDetails } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import ErrorModal from '../../Components/organisms/ErrorModal';
import LocalStrings from '../../Language/Strings';


const IndividualJob = ({ navigation, route }) => {

  const [saveJobModal, setSaveJobModal] = useState(false);
  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [loader, setLoader] = useState(false);
  const [applyJobModal, setApplyJobModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const jobDetails = useSelector(jobViewDetails);

  const url = `${Constants.url.Map}${jobDetails.st_address}, ${jobDetails.city}, ${jobDetails.state}, ${jobDetails.zipcode}`


  async function saveJob() {
    setLoader(true)

    let body = {
      job_id: jobDetails.id
    }

    try {
      var response = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.MarkSavedJob,
        body
      );

      if (response.isAxiosError == true) {
        setErrorMessage(response.response.data.error.messages.map(val => val + '\n'))
        setLoader(false)
        setErrorModal(true)
        //alert(response.response.data.error.messages.map(val => val + '\n'))
      }
      else {
        setLoader(false)
        setSaveJobModal(true)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
      setLoader(false)
    }
  }

  async function applyJob() {
    setLoader(true)

    let body = {
      job_id: jobDetails.id
    }

    try {
      var response = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.ApplyJob,
        body
      );

      if (response.isAxiosError == true) {
        setErrorMessage(response.response.data.error.messages.map(val => val + '\n'))
        setErrorModal(true)
        // console.log('Axios error')
        setLoader(false)
        // alert(response.response.data.error.messages.map(val => val + '\n'))
      }
      else {
        setLoader(false)
        setApplyJobModal(true)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
      setLoader(false)
    }
  }

  if (loader == true) {
    return (
      <Loader />
    )
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

      <StatusBar />

      <CustomModal
        type='confirmation'
        isVisible={saveJobModal == true ? saveJobModal : applyJobModal}
        message={saveJobModal == true ? 'Job is saved.' : 'Applied'}
        imageSource={require('../../../assets/checked.png')}
        onPressOk={() => {
          navigation.navigate(Constants.screen.SavedJobs)
          setSaveJobModal(false)
          setIsSave(false);
          setApplyJobModal(false)
        }}
      />

      <ErrorModal 
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bgContainer}>

        <HeaderImage />

        <View style={{ position: 'absolute', width: '100%', padding: 9, flex: 1 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <View>
              <MenuIcon onPress={() => navigation.openDrawer()} />
              <Logo />
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

          <View style={styles.JobContainer}>
            <Image source={jobDetails.image_urls ? { uri: jobDetails.image_urls['3x'] } : require('../../../assets/people.jpg')} style={styles.image} />

            <TouchableOpacity style={{ position: 'absolute', top: 12, left: 12 }} onPress={() => navigation.goBack()}>
              <Ionicons name='arrow-back-circle' size={30} color={colors.darkGray} />
            </TouchableOpacity>

            <View style={styles.jobTitleContainer}>

              <Text
                ellipsizeMode='tail'
                numberOfLines={2}
                style={{ fontSize: 22, fontWeight: 'bold', color: colors.primaryColor, flex: 1, marginRight: 5 }}
              >
                {jobDetails.employername['name']}
              </Text>

              <TouchableOpacity disabled={true} onPress={() => {
                // saveJob()
                // //setIsSave(!isSave)
              }}
              >
                <FontAwesome
                  name={jobDetails.is_saved == 1 ? "bookmark" : 'bookmark-o'}
                  color={colors.primaryColor}
                  size={26}
                />
              </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'space-between' }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Ionicons name='document-text-sharp' size={25} color={colors.primaryColor} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>Job Description</Text>

              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ marginRight: 2, color: colors.gray }}>No of Posts:</Text>
                  <Text style={{ fontWeight: 'bold' }}>{jobDetails.no_of_posts}</Text>
                </View>

                <Ionicons name='people' size={22} color={colors.primaryColor} style={{ marginLeft: 3 }} />

              </View>

            </View>

            <Text style={{ paddingLeft: 15, paddingRight: 15 }}>{jobDetails.description}</Text>

            <Divider style={{ marginLeft: 15, marginTop: 15, width: '90%' }} />

            <IconText style={{ alignItems: 'center' }} text='Designa' textStyle={{ color: 'black', fontWeight: 'bold', fontSize: 14 }}>
              <MaterialIcons name='person' size={25} color={colors.primaryColor} />
            </IconText>

            <Text style={{ marginLeft: 35, marginTop: 2, color: colors.gray }}>{jobDetails.title}</Text>

            <Divider style={{ marginLeft: 15, marginTop: 15, width: '90%' }} />

            <IconText style={{ alignItems: 'center' }} text='Location' textStyle={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
              <Ionicons name='location-sharp' size={25} color={colors.primaryColor} />
            </IconText>

            <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginLeft: 35, marginRight: 9, marginTop: 2, color: colors.gray }}>
              {`${jobDetails.st_address}, ${jobDetails.state}, ${jobDetails.city}, ${jobDetails.zipcode}`}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 10 }}>

              <TouchableOpacity
                style={{ marginLeft: 35 }}
                onPress={() => Linking.openURL(url).catch(err => console.error('An error occurred', err))}
              >
                <Text style={{ fontSize: 12, color: colors.buttonColor }}>Click here to view full address</Text>
              </TouchableOpacity>

              <MaterialIcons name='location-city' size={20} color={colors.primaryColor} style={{ marginLeft: 3 }} />

            </View>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>

              <Button
                title='Apply'
                style={styles.button} 
                onPress={() => applyJob()}
              />

              <Button
                disabled={jobDetails.is_saved == '1' ? true : false}
                style={{...styles.saveButton,  backgroundColor: jobDetails.is_saved == '1' ? colors.gray : colors.yellow}}
                titleStyle={{ color: 'black' }}
                title='Save Job'
                iconName='bookmark'
                iconColor='black'
                onPress={() => saveJob()}
              />

            </View>

          </View>

        </View>

        <CompanyLabelCard />

      </ImageBackground>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bgContainer: {
    height: Dimensions.get('screen').height + 70,
    width: Dimensions.get('window').width
  },
  JobContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginTop: 15,
  },
  jobTitleContainer: {
    backgroundColor: colors.white,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 30
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  screenContainer: {
    backgroundColor: colors.lightGray,
    height: Dimensions.get('screen').height * 1.1
    //height: 835
  },
  button: {
    flex: 1,
    height: Dimensions.get('screen').height * 0.08,
    borderBottomLeftRadius: 40,
    borderRadius: 0
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.yellow,
    height: Dimensions.get('screen').height * 0.08,
    borderRadius: 0,
    borderBottomRightRadius: 40
  },
})

export default IndividualJob;