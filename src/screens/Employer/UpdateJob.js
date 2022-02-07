import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, Image, ImageBackground, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import HeaderImage from '../../Components/atoms/HeaderImage';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ScreenTitle from '../../Components/atoms/ScreenTitle';
import Button from '../../Components/molecules/Button';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import InputField from '../../Components/molecules/InputField';
import { cityStates } from '../../Components/organisms/CityStates';
import CustomModal from '../../Components/organisms/CustomModal';
import CustomPicker from '../../Components/organisms/CustomPicker';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import StatePicker from '../../Components/organisms/StatePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { jobPostedSelector, jobsCategoryList, setJobPost } from '../../redux/slices';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import Loader from '../../Components/atoms/Loader';
import ErrorModal from '../../Components/organisms/ErrorModal';


const UpdateJob = ({ navigation, route }) => {

  const {params} = route.params

  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [hourlyPay, setHourlyPay] = useState('');
  const [jobDuration, setJobDuration] = useState(0);
  const [description, setDescription] = useState('');
  const [jobCategory, setJobCategory] = useState(0);
  const [subJobCategory, setSubJobCategory] = useState(0);
  const [address, setAddress] = useState('');
  const [statePicker, setStatePicker] = useState(0);
  const [city, setCity] = useState(0);
  const [jobPostNos, setJobPostNos] = useState(0);;
  const [imageUrl, setImageUrl] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [updateJobModal, setUpdateJobModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [missingFieldModal, setMissingFieldModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  
  //const job = useSelector(jobPostedSelector);
  
  const jobCategoryList = useSelector(jobsCategoryList);
  const subCategoryItems = jobCategoryList?.filter(val => val.category_id_decode == jobCategory)[0]?.subcategories
  
  
  const cities = cityStates.filter((value) => value.state == statePicker)
  const cityItems = cities.length > 0 ? cities[0].cities : null

  useEffect(() => {
    setJobTitle(params.title)
    setHourlyPay(params.hourly_pay)
    setJobDuration(params.duration)
    setDescription(params.description)
    setJobCategory(params.category_id)
    setSubJobCategory(params.sub_category_id ? params.sub_category_id : 0)
    //setImageUrl(params.image_urls ? params.image_urls['3x'] : '')
    setJobPostNos(params.no_of_posts ? params.no_of_posts : '0')
    setAddress(params.st_address)
    setStatePicker(params.state)
    setCity(params.city)
    setZipCode(params.zipcode)
  }, [isFocused])

  //console.log('PARAMS IMAGE:',params.image_urls)

  var bodyFormData = new FormData();
  bodyFormData.append('id', params.id)
  bodyFormData.append('title', jobTitle)
  bodyFormData.append('category_id', jobCategory)
  subJobCategory != 0 && bodyFormData.append('sub_category_id', subJobCategory)
  bodyFormData.append('hourly_pay', hourlyPay)
  bodyFormData.append('duration', jobDuration)
  bodyFormData.append('description', description)
  bodyFormData.append('st_address', address)
  bodyFormData.append('city', city)
  bodyFormData.append('state', statePicker)
  imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'test_image', type: 'image/*' })
  bodyFormData.append('zipcode', zipCode)
  jobPostNos != 0 && bodyFormData.append('no_of_posts', jobPostNos)


  const updateJob = async () => {
    setLoader(true)

    try {
      var apiResponse = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.UpdateJob,
        bodyFormData
      );

      if (apiResponse.isAxiosError == true) {
        setErrorMessage(apiResponse.response.data.error.messages.map(val => val+'\n'))
        setErrorModal(true)
        setLoader(false)
      }
      else {
        setLoader(false)
        setUpdateJobModal(true)
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
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        <CustomModal 
          type='confirmation'
          isVisible={updateJobModal}
          message='Job has been successfully updated.'
          imageSource={require('../../../assets/checked.png')}
          onPressOk={() => {
            navigation.navigate(Constants.screen.JobPostedList)
            setUpdateJobModal(false)
            setJobTitle('')
            setHourlyPay('')
            setJobDuration(0)
            setJobCategory(0)
            setSubJobCategory(0)
            setDescription('');
            setJobPostNos(0);
            setImageUrl('')
            setAddress('')
            setStatePicker(0)
            setCity('')
            setZipCode('')
          }}
          buttonText='Ok'
        />

        <ErrorModal 
          isVisible={errorModal}
          message={errorMessage}
          onPress={() => setErrorModal(false)}
        />

        <CustomModal 
          type='confirmation'
          isVisible={missingFieldModal}
          message='Some fields are missing.'
          imageSource={require('../../../assets/warning.png')}
          onPressOk={() => setMissingFieldModal(false)}
          buttonText='Ok'
        />

      <StatusBar backgroundColor={colors.primaryColor} />

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>

        <HeaderImage style={{ height: Dimensions.get('window').height * 0.15 }} />

        <HeaderRowContainer>

          <MenuIcon onPress={() => navigation.openDrawer()} />

          <ScreenTitle title= 'Job Update'/>

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
            //textStyle={{color: job.jobTitle == '' ? 'red' : colors.primaryColor}}
            title='Job Title'
            iconName='person'
            placeholder='Job Title'
            value={jobTitle}
            maxLength={30}
            onChangeText={setJobTitle}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <InputField
              //textStyle={{color: job.hourlyPay == '' ? 'red' : colors.primaryColor}}
              style={{ flex: 0.45 }}
              keyboardType={'number-pad'}
              title='Hourly Pay'
              iconName='person'
              placeholder='0$'
              maxLength={5}
              value={hourlyPay}
              onChangeText={setHourlyPay}
            />

            <CustomPicker
              //pickerTitleStyle={{color: job.duration == 0 ? 'red' : colors.primaryColor}}
              pickerContainerStyle={{ marginTop: 10, flex: 0.52  }}
              label='Job Type'
              pickerTitle='Duration'
              selectedValue={jobDuration}
              onValueChange={(itemValue, itemIndex) => setJobDuration(itemValue)}
            >
            <Picker.Item label='Part Time' value={'part_time'} style={{ fontSize: 14 }} />
            <Picker.Item label='Full Time' value={'full_time'} style={{ fontSize: 14 }} />
            
          </CustomPicker>

          </View>

          <CustomPicker
            //pickerTitleStyle={{color: job.jobCategory == 0 ? 'red' : colors.primaryColor}}
            pickerContainerStyle={{ marginTop: 10 }}
            label='Select Job Category'
            pickerTitle='Job Category'
            selectedValue={jobCategory}
            onValueChange={(itemValue, itemIndex) => setJobCategory(itemValue)}
          >
            {
              jobCategoryList.map((val, index) => (
                <Picker.Item key={index} label={val.name} value={val.category_id_decode} />
              ))
            }
          </CustomPicker>

          <CustomPicker
            //pickerTitleStyle={{color: job.jobSubCategory == 0 ? 'red' : colors.primaryColor}}
            pickerContainerStyle={{ marginTop: 10 }}
            label='Select Job Sub Category'
            pickerTitle='Job Sub Category'
            selectedValue={subJobCategory}
            onValueChange={(itemValue, itemIndex) => setSubJobCategory(itemValue)}
          >
            {
              subCategoryItems != null ?
                subCategoryItems.map((val, index) => (
                  <Picker.Item key={index} label={val.name} value={val.id} />
                ))
                : null
            }
          </CustomPicker>

           <Text style={styles.uploadImageText}>Upload Image</Text>

           <View style={{flexDirection: 'row', marginTop: 4, justifyContent: 'space-between'}}>
             <View style={(imageUrl == '' && params.image_urls == undefined) ? styles.EmptyUploadImageContainer : styles.UploadImageContainer}>
               <MaterialIcons name='cloud-upload' size={18} color={colors.gray}/>
               <Text style={imageUrl == '' ? styles.emptyUploadImageText : {color: colors.gray, opacity: 0.7}}>Upload Image</Text>
               {
              imageUrl != '' || params.image_urls != undefined ? 
                <Image 
                  source={(params.image_urls != undefined && imageUrl == '') ? {uri: params.image_urls['3x']} : {uri: imageUrl}} 
                  style={{height: 40, width: 50, borderRadius: 5}}
                />
              : null
            }
             </View>

            <Button
              style={{backgroundColor: colors.primaryColor, padding: 5, borderRadius: 15, height: Dimensions.get('window').height * 0.065}}
              titleStyle={{marginLeft: 5}} 
              iconName={'cloud-upload'}
              title='Upload'
              onPress={() => {
                pickFromGallery()
                // let options;
                // launchImageLibrary(options={
                //   mediaType: 'photo',
                //   maxHeight: 500,
                //   maxWidth: 500
                // }, (response) => {
                //   if(response.didCancel){
                //     console.log('User cancelled image picker');
                //     setImageUrl('')
                //   } else if (response.errorMessage){
                //     console.log('Error:',response.errorMessage)
                //   }else{
                //     const source = response?.assets[0].uri
                //     //const source = {uri: response.assets[0].uri}
                //     setImageUrl(source)
                //     //setImageFileName(response.assets[0].fileName)
                //   }
                // })
              }}
            />
           </View>

          <InputField
            //textFieldStyle={{backgroundColor: 'green'}}
            //textStyle={{color: job.jobDescription == '' ? 'red' : colors.primaryColor}}
            title='Description'
            placeholder='Job Description'
            maxLength={250}
            multiline={true}
            //inputFieldStyle={{height: 0, padding: 10}}
            inputFieldStyle={{ alignItems: 'flex-start', height: Dimensions.get('window').height * 0.2 }}
            value={description}
            onChangeText={setDescription}
          />
          <Text style={{ alignSelf: 'flex-end', color: colors.darkGray, fontWeight: 'bold', fontSize: 12 }}>
            {`${description?.length} / 250 Characters`}
          </Text>

          <CustomPicker
            //pickerTitleStyle={{color: job.noOfEmployees == 0 ? 'red' : colors.primaryColor}}
            pickerContainerStyle={{ marginTop: 10 }}
            label='Select No. Of Employees'
            pickerTitle='No. Of Employees'
            selectedValue={jobPostNos}
            onValueChange={(itemValue, itemIndex) => setJobPostNos(itemValue)}
            // onValueChange={(itemValue, itemIndex) => {
            //   jobObj.noOfEmployees = itemValue
            //   dispatch(setJobPost(jobObj))
            // }}
          >
            <Picker.Item label={'1'} value={1} />
            <Picker.Item label={'2'} value={2} />
            <Picker.Item label={'3'} value={3} />
            <Picker.Item label={'4'} value={4} />
            <Picker.Item label={'5'} value={5} />
          </CustomPicker>

          <InputField
            //textStyle={{color: job.address == '' ? 'red' : colors.primaryColor}}
            title='Address'
            placeholder='Address'
            iconName='location-sharp'
            value={address}
            onChangeText={setAddress}
            // onChangeText={(val) => {
            //   jobObj.address = val
            //   dispatch(setJobPost(jobObj))
            // }}
          />

          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}

            <StatePicker
              //pickerTitleStyle={{color: job.state == 0 ? 'red' : colors.primaryColor}}
              pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
              items={cityStates}
              selectedValue={statePicker}
              onValueChange={(itemValue, itemIndex) => setStatePicker(itemValue)}
              // selectedValue={job.state}
              // onValueChange={(itemValue, itemIndex) => {
              //   jobObj.state = itemValue
              //   dispatch(setJobPost(jobObj))
              // }}
            />

            <CustomPicker
              //pickerTitleStyle={{color: job.city == 0 ? 'red' : colors.primaryColor}}
              pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
              label='Select City'
              pickerTitle='City'
              selectedValue={city}
              onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
              // selectedValue={job.city}
              // onValueChange={(itemValue, itemIndex) => {
              //   jobObj.city = itemValue
              //   dispatch(setJobPost(jobObj))
              // }}
            >
              {
                cities.length > 0 ?
                  cityItems.map((val, index) => (
                    <Picker.Item key={index} label={val.city} value={val.city} style={{fontSize: 14}}/>
                  ))
                  : null
              }
            </CustomPicker>

          {/* </View> */}

          

          <InputField
            //textStyle={{color: job.zipCode == '' ? 'red' : colors.primaryColor}}
            keyboardType={'number-pad'}
            maxLength={5}
            title='Zip Code'
            placeholder='Zip Code'
            value={zipCode}
            onChangeText={setZipCode}
            // onChangeText={(val) => {
            //   jobObj.zipCode = val
            //   dispatch(setJobPost(jobObj))
            // }}
          />

         

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 7}}>
            <TouchableOpacity
            onPress={() => Linking.openURL(`https://www.google.com/maps/search/${address}, ${city}, ${statePicker}, ${zipCode}`)
            .catch(err => console.error('An error occurred', err))
            }
             //onPress={() => Linking.openURL(`https://www.google.com/maps/search/' + 'Sybrid Pvt Ltd Karachi Pakistan').catch(err => console.error('An error occurred', err))}
            >
              <Text style={{fontSize: 12, color: colors.buttonColor}}>Click here to view full address</Text>
            </TouchableOpacity>

            <MaterialIcons name='location-city' size={20} color={colors.primaryColor} style={{ marginLeft: 3 }} />

          </View>

        </View>

        <View style={styles.bottomButtonContainer}>

          <Button
            style={{ ...styles.button, backgroundColor: colors.primaryColor }}
            title='Post'
            onPress={() => {
              if(jobTitle == '' || hourlyPay == '' || jobDuration == 0 || jobCategory == 0 || description == '' || statePicker == 0 || city == 0 || address == '' || (zipCode == '' || zipCode == null)){
                setMissingFieldModal(true)
              }
              else{
                updateJob()
              }
            }}
          />

          <Button
            style={styles.button}
            title='Cancel'
            onPress={() => navigation.goBack()}
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
  emptyUploadImageText:{
    color: colors.gray,
    opacity: 0.7,
    marginLeft: 7
  },
  chooseFileButton: {
    //flexDirection: 'column',
    height: Dimensions.get('window').height * 0.06,
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: colors.primaryColor,
    padding: 5
    //flex: 0.45
    //width: 130
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
  uploadImageText:{
    marginLeft: 7, 
    marginTop: 10, 
    fontWeight: 'bold', 
    color: colors.primaryColor
  },
  EmptyUploadImageContainer:{
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    borderRadius: 15, 
    borderColor: colors.gray, 
    borderWidth: 1.5, 
    flex: 0.93, 
    height: Dimensions.get('window').height * 0.065
  },
  UploadImageContainer:{
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
  emptyScreenContainer:{
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  buttonText:{
    color: colors.buttonColor, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline'
  }
})

export default UpdateJob;