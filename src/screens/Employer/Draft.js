import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import HeaderImage from '../../Components/atoms/HeaderImage';
import Loader from '../../Components/atoms/Loader';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ScreenTitle from '../../Components/atoms/ScreenTitle';
import Button from '../../Components/molecules/Button';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import InputField from '../../Components/molecules/InputField';
import { cityStates } from '../../Components/organisms/CityStates';
import CustomModal from '../../Components/organisms/CustomModal';
import CustomPicker from '../../Components/organisms/CustomPicker';
import ErrorModal from '../../Components/organisms/ErrorModal';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import StatePicker from '../../Components/organisms/StatePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { jobPostedSelector, jobsCategoryList, setJobPost } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';


const Draft = ({ navigation }) => {

  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [loader, setLoader] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const job = useSelector(jobPostedSelector);
  const categoryList = useSelector(jobsCategoryList);
  var jobObj = { ...job }

  const subCategoryItems = categoryList?.filter(val => val.category_id_decode == job.jobCategory)[0]?.subcategories


  const cities = cityStates.filter((value) => value.state == job.state)
  const cityItems = cities.length > 0 ? cities[0].cities : null

  const dispatch = useDispatch();

  var bodyFormData = new FormData();

  bodyFormData.append('title', job.jobTitle)
  bodyFormData.append('category_id', job.jobCategory)
  job.jobSubCategory != 0 && bodyFormData.append('sub_category_id', job.jobSubCategory)
  bodyFormData.append('hourly_pay', job.hourlyPay)
  bodyFormData.append('duration', job.duration)
  bodyFormData.append('description', job.jobDescription)
  bodyFormData.append('st_address', job.address)
  bodyFormData.append('city', job.city)
  bodyFormData.append('state', job.state)
  imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'test_image', type: 'image/*' })
  bodyFormData.append('zipcode', job.zipCode)
  job.noOfEmployees != 0 && bodyFormData.append('no_of_posts', job.noOfEmployees)


  async function jobPosted() {

    try {
      setLoader(true);

      var apiResponse = await apiCall(ApiConstants.methods.POST, ApiConstants.endPoints.PostJob, bodyFormData);

      if (apiResponse.isAxiosError == true) {
        setErrorMessage(apiResponse.response.data.error.messages.map(val => val+'\n'))
        setErrorModal(true)
        setLoader(false)
      }
      else {
        setLoader(false)
        setSuccessModal(true);
        setErrorModal(false)
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

  const onCancel = () => {
    jobObj.jobTitle = '',
    jobObj.hourlyPay = '',
    jobObj.duration= 0,
    jobObj.jobCategory= 0,
    jobObj.jobSubCategory= 0,
    jobObj.jobDescription= '',
    jobObj.noOfEmployees= 0,
    jobObj.state= 0,
    jobObj.city= 0,
    jobObj.zipCode= '',
    jobObj.address= '',
    dispatch(setJobPost(jobObj))
  }

  const pickFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 500,
      maxWidth: 500
    }, (response) => {
      if(response?.didCancel){
        setImageUrl('')
      }
      else if (response?.errorMessage){
        console.log('Error:',response?.errorMessage)
      }
      else{
        const source = response?.assets[0].uri
        setImageUrl(source)
      }
    })
  }


  return (
    (jobObj.jobTitle == '' && jobObj.hourlyPay == '' && jobObj.duration == 0 && jobObj.jobCategory == 0 && jobObj.jobSubCategory == 0 && jobObj.jobDescription == '' && jobObj.noOfEmployees == 0 && jobObj.state == 0 && jobObj.city == 0 && jobObj.zipCode == '' && jobObj.address == '') ?

      <View style={styles.emptyScreenContainer}>
        <Image source={require('../../../assets/noData.jpg')} resizeMode='contain' style={{ height: 300, width: 400 }} />
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate(Constants.screen.JobPosted)}>
          <Text style={styles.buttonText}>Click here to post a job</Text>
        </TouchableOpacity>
      </View>
      :
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

            <CustomModal
              type='confirmation'
              isVisible={modalVisible}
              message='Some fields are missing.'
              imageSource={require('../../../assets/warning.png')}
              onPressOk={() => {
                setModalVisible(false)
                setIsFieldEmpty(true)
              }}
              buttonText='Ok'
            />

            <CustomModal
              type='confirmation'
              isVisible={successModal}
              message='Job has been successfully created.'
              imageSource={require('../../../assets/checked.png')}
              onPressOk={() => {
                setSuccessModal(false)
                setIsFieldEmpty(false)
                navigation.navigate(Constants.screen.JobPostedList)
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
              buttonText='Ok'
            />

            <ErrorModal 
              isVisible={errorModal}
              message={errorMessage}
              onPress={() => setErrorModal(false)}
            />

        <StatusBar backgroundColor={colors.primaryColor} />

        <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>

          <HeaderImage style={{ height: Dimensions.get('window').height * 0.15 }} />

          <HeaderRowContainer>

            <MenuIcon onPress={() => navigation.openDrawer()} />

            <ScreenTitle title='Draft' />

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
            <InputField
              textStyle={{ color: job.jobTitle == '' && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              title='Job Title'
              iconName='person'
              placeholder='Job Title'
              maxLength={30}
              value={job.jobTitle}
              onChangeText={(val) => {
                jobObj.jobTitle = val
                dispatch(setJobPost(jobObj))
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <InputField
                textStyle={{ color: job.hourlyPay == '' && isFieldEmpty == true ? 'red' : colors.primaryColor }}
                style={{ flex: 0.45 }}
                keyboardType={'number-pad'}
                maxLength={5}
                title='Hourly Pay'
                iconName='person'
                placeholder='$0.00'
                value={job.hourlyPay}
                onChangeText={(val) => {
                  jobObj.hourlyPay = val
                  dispatch(setJobPost(jobObj))
                }}
              />

              <CustomPicker
                pickerTitleStyle={{ color: job.duration == 0 && isFieldEmpty == true ? 'red' : colors.primaryColor }}
                pickerContainerStyle={{ marginTop: 10, flex: 0.52 }}
                label='Job Type'
                pickerTitle='Duration'
                selectedValue={job.duration}
                onValueChange={(itemValue, itemIndex) => {
                  jobObj.duration = itemValue
                  dispatch(setJobPost(jobObj))
                }}
              >
                <Picker.Item label='Part Time' value={'part_time'} style={{fontSize: 14}}/>
                <Picker.Item label='Full Time' value={'full_time'} style={{fontSize: 14}}/>

              </CustomPicker>

            </View>

            <CustomPicker
              pickerTitleStyle={{ color: job.jobCategory == 0 && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              pickerContainerStyle={{ marginTop: 10 }}
              label='Select Job Category'
              pickerTitle='Job Category'
              selectedValue={job.jobCategory}
              onValueChange={(itemValue, itemIndex) => {
                jobObj.jobCategory = itemValue
                dispatch(setJobPost(jobObj))
              }}
            >
              {
                categoryList.map((val, index) => (
                  <Picker.Item 
                    key={index} 
                    label={val.name} 
                    value={val.category_id_decode} 
                    style={{fontSize: 14}}
                  />
                ))
              }
            </CustomPicker>

            <CustomPicker
              pickerTitleStyle={{ color: (subCategoryItems != null && job.jobSubCategory == 0 && isFieldEmpty == true) ? 'red' : colors.primaryColor }}
              pickerContainerStyle={{ marginTop: 10 }}
              label='Select Job Sub Category'
              pickerTitle='Job Sub Category'
              selectedValue={job.jobSubCategory}
              onValueChange={(itemValue, itemIndex) => {
                jobObj.jobSubCategory = itemValue
                dispatch(setJobPost(jobObj))
              }}
            >
              {
                subCategoryItems != null ?
                  subCategoryItems.map((val, index) => (
                    <Picker.Item key={index} label={val.name} value={val.id} style={{fontSize: 14}}/>
                  ))
                  : null
              }
            </CustomPicker>

            <Text style={styles.uploadImageText}>Upload Image</Text>

            <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
              <View style={imageUrl == '' ? styles.EmptyUploadImageContainer : styles.UploadImageContainer}>
                <MaterialIcons name='cloud-upload' size={18} color={colors.gray} />
                <Text style={imageUrl == '' ? styles.emptyUploadImageText : { color: colors.gray, opacity: 0.7 }}>Upload Image</Text>
                {
                  imageUrl != '' ? <Image source={{ uri: imageUrl }} style={{ height: 40, width: 50, borderRadius: 5 }} />
                    : null
                }
              </View>

              <Button
                style={{ backgroundColor: colors.primaryColor, padding: 5, borderRadius: 15, height: Dimensions.get('window').height * 0.065 }}
                titleStyle={{ marginLeft: 5 }}
                iconName={'cloud-upload'}
                title='Upload'
                onPress={() => {
                  pickFromGallery()
                }}
              />
            </View>

            <InputField
              textStyle={{ color: job.jobDescription == '' && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              title='Description'
              placeholder='Job Description'
              maxLength={250}
              multiline={true}
              inputFieldStyle={{ alignItems: 'flex-start', height: Dimensions.get('window').height * 0.2 }}
              value={job.jobDescription}
              onChangeText={(val) => {
                jobObj.jobDescription = val
                dispatch(setJobPost(jobObj))
              }}
            />
            <Text style={{ alignSelf: 'flex-end', color: colors.darkGray, fontWeight: 'bold', fontSize: 12 }}>
              {`${job.jobDescription.length} / 250 Characters`}
            </Text>

            <CustomPicker
              pickerContainerStyle={{ marginTop: 10 }}
              label='Select No. Of Employees'
              pickerTitle='No. Of Employees'
              selectedValue={job.noOfEmployees}
              onValueChange={(itemValue, itemIndex) => {
                jobObj.noOfEmployees = itemValue
                dispatch(setJobPost(jobObj))
              }}
            >
              <Picker.Item label={'1'} value={'1'} style={{fontSize: 14}}/>
              <Picker.Item label={'2'} value={'2'} style={{fontSize: 14}}/>
              <Picker.Item label={'3'} value={'3'} style={{fontSize: 14}}/>
              <Picker.Item label={'4'} value={'4'} style={{fontSize: 14}}/>
              <Picker.Item label={'5'} value={'5'} style={{fontSize: 14}}/>
            </CustomPicker>

            <InputField
              inputFieldStyle={job.address.length > 35 && {height: Dimensions.get('window').height * 0.078}}
              textStyle={{ color: job.address == '' && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              title='Address'
              placeholder='Address'
              iconName='location-sharp'
              multiline={job.address.length > 35 ? true : false}
              maxLength={50}
              value={job.address}
              onChangeText={(val) => {
                jobObj.address = val
                dispatch(setJobPost(jobObj))
              }}
            />

            <StatePicker
              pickerTitleStyle={{ color: job.state == 0 && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
              items={cityStates}
              selectedValue={job.state}
              onValueChange={(itemValue, itemIndex) => {
                jobObj.state = itemValue
                dispatch(setJobPost(jobObj))
              }}
            />

            <CustomPicker
              pickerTitleStyle={{ color: job.city == 0 && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
              label='Select City'
              pickerTitle='City'
              selectedValue={job.city}
              onValueChange={(itemValue, itemIndex) => {
                jobObj.city = itemValue
                dispatch(setJobPost(jobObj))
              }}
            >
              {
                cities.length > 0 ?
                  cityItems.map((val, index) => (
                    <Picker.Item key={index} label={val.city} value={val.city} style={{fontSize: 14}}/>
                  ))
                  : null
              }
            </CustomPicker>

            <InputField
              textStyle={{ color: job.zipCode == '' && isFieldEmpty == true ? 'red' : colors.primaryColor }}
              keyboardType={'number-pad'}
              maxLength={5}
              title='Zip Code'
              placeholder='Zip Code'
              value={job.zipCode}
              onChangeText={(val) => {
                jobObj.zipCode = val
                dispatch(setJobPost(jobObj))
              }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 7 }}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`${Constants.Map}${job.address}, ${job.state}, ${job.city}, ${job.zipCode}`)
                .catch(err => console.error('An error occurred', err))
              }
              >
                <Text style={{ fontSize: 12, color: colors.buttonColor }}>Click here to view full address</Text>
              </TouchableOpacity>

              <MaterialIcons name='location-city' size={20} color={colors.primaryColor} style={{ marginLeft: 3 }} />

            </View>

          </View>

          <View style={styles.bottomButtonContainer}>

            <Button
              style={{ ...styles.button, backgroundColor: colors.primaryColor }}
              title='Post'
              onPress={() => {
                if (jobObj.jobTitle = '' || jobObj.hourlyPay == '' || jobObj.duration == 0 || jobObj.jobCategory == 0 || jobObj.jobDescription == '' || jobObj.state == 0 || jobObj.city == 0 || jobObj.zipCode == '' || jobObj.address == '') {
                  setModalVisible(true)
                }
                else {
                  jobPosted()
                  setSuccessModal(true)
                }
              }}
            />

            <Button
              style={styles.button}
              title='Cancel'
              onPress={() => {
                onCancel()
                navigation.navigate(Constants.screen.EmployerDashboard)
                setIsFieldEmpty(false)
              }}
            />

          </View>

        </ImageBackground>

      </ScrollView>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: Dimensions.get('window').width
  },
  screenTitle: {
    alignSelf: 'center',
    marginTop: 20,
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold'
  },
  infoContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 9,
    marginHorizontal: 9,
    padding: 10
  },
  picker: {
    marginTop: 4,
    height: Dimensions.get('window').height * 0.065,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gray,
    justifyContent: 'center'
  },
  emptyUploadImageText: {
    color: colors.gray,
    opacity: 0.7,
    marginLeft: 7
  },
  chooseFileButton: {
    height: Dimensions.get('window').height * 0.06,
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: colors.primaryColor,
    padding: 5
  },
  picker: {
    marginTop: 4,
    height: Dimensions.get('window').height * 0.065,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gray,
    justifyContent: 'center'
  },
  mapView: {
    marginTop: 20,
    overflow: 'hidden',
    height: Dimensions.get('window').height * 0.15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'gray'
  },
  bottomButtonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    borderRadius: 0,
    height: Dimensions.get('window').height * 0.085,
  },
  uploadImageText: {
    marginLeft: 7,
    marginTop: 10,
    fontWeight: 'bold',
    color: colors.primaryColor
  },
  EmptyUploadImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1.5,
    flex: 0.93,
    height: Dimensions.get('window').height * 0.065
  },
  UploadImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1.5,
    flex: 0.93,
    height: Dimensions.get('window').height * 0.065
  },
  emptyScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.buttonColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
})

export default Draft;