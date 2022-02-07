import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderImage from '../../Components/atoms/HeaderImage';
import Loader from '../../Components/atoms/Loader';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ScreenTitle from '../../Components/atoms/ScreenTitle';
import Button from '../../Components/molecules/Button';
import SearchField from '../../Components/molecules/SearchField';
import CustomModal from '../../Components/organisms/CustomModal';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { getSaveJobList, getViewJob, savedJobsList } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import { useDispatch, useSelector } from 'react-redux';



const SavedJobs = ({ navigation }) => {

  const [dropDown, setDropDown] = useState(false);
  const [lang, setLang] = useState('eng');
  const [manageJobIcons, setManageJobIcons] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deletJobModal, setDeleteJobModal] = useState(false);
  const [confirmDeletedModal, setConfirmDeletedModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState('');
  const [searchJob, setSearchJob] = useState('');

  const dispatch = useDispatch();

  const savedList = useSelector(savedJobsList);


  var searchSaveJob;
  if(searchJob != ''){
    searchSaveJob = savedList.filter((value) => (
      value.job.title.toLowerCase().includes(searchJob.toLowerCase())
    ))
  }
  else{
    searchSaveJob = savedList
  }


  const jobCard = ({ item }) => {
    return (
      <View style={styles.jobContainer}>

        <Image source={item.job['image'] ? {uri: item.job['image']} : require('../../../assets/people.jpg')} style={styles.jobImage} />

        <View style={{ marginLeft: 8, flex: 1}}>

          <Text ellipsizeMode='tail' numberOfLines={1} style={styles.jobTitle}>{item.job['title']}</Text>

          <Text ellipsizeMode='tail' numberOfLines={3} style={{ fontSize: 12 }}>
            {item.job['description']}
          </Text>

          <View style={styles.jobIconsContainer}>
            {
              manageJobIcons == true ?
                <>
                  <TouchableOpacity 
                    style={{ alignItems: 'center' }} 
                    onPress={() => {
                      viewJob(item.job.id)
                    }}
                  >
                    <Ionicons name='eye' size={18} color={colors.buttonColor} />
                    <Text style={{ fontSize: 10 }}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.icons}
                    onPress={() => {
                      setDeleteJobId(item.id)
                      setDeleteJobModal(true)
                    }}
                  >
                    <MaterialCommunityIcons name='delete' size={18} color='red' />
                    <Text style={{ fontSize: 10 }}>Delete</Text>
                  </TouchableOpacity>
                </>
                : null
            }

            <Button
              title='Manage Jobs'
              titleStyle={{ fontSize: 12 }}
              style={styles.manageJobButton}
              onPress={() => setManageJobIcons(!manageJobIcons)}
            />

          </View>
        </View>

      </View>
    )
  }

async function viewJob(jobId) {
    
    setLoader(true)

    let queryParams = {
      id: jobId
    }

    try {
      var apiResult = await apiCall(
        ApiConstants.methods.GET, 
        ApiConstants.endPoints.ViewJob,
        {},
        queryParams
        )

      if (apiResult.isAxiosError == true) {
        alert(apiResult.response.data.error.messages.map(val => val+'\n'))
        setLoader(false)
      }
      else {
        dispatch(getViewJob(apiResult.data.response.data[0]))
        navigation.navigate(Constants.screen.IndividualJob)
        setLoader(false)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
      setLoader(false)
    }
  }

  async function getSavedJobsList(){
    setLoader(true)

    if(savedList != undefined){
      setLoader(false);
    }

    try{
      var response = await apiCall(
        ApiConstants.methods.GET, 
        ApiConstants.endPoints.SavedJobsList,
      );

      if(response.isAxiosError == true){
        console.log('Axios error') 
        setLoader(false)
      }
      else{
        dispatch(getSaveJobList(response.data.response.data))
        setLoader(false)
      }
    }
    catch(error){
      console.log('Catch Body:',error);
      setLoader(false)
    }
  }

  const deleteSaveJob = async (id) => {
    setLoader(true)

    let body = {
      is_block: '1',
      id: id
    }

    try {
      var apiResponse = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.DeleteSavedJob,
        body
      );

      if (apiResponse.isAxiosError == true) {
        console.log('Delete Save Job Axios error')
        alert(apiResponse.response.data.error.messages.map(val => val+'\n'))
        setLoader(false)
      }
      else {
        setLoader(false)
        setConfirmDeletedModal(true)
      }
    }
    catch (error) {
      console.log('Catch Body:', error);
      setLoader(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getSavedJobsList();
    }, [])
  )

  if(loader == true){
    return(
      <Loader />
    )
  }

  return (
    savedList.length > 0
    ?
    <View style={{ flex: 1 }}>

      <StatusBar backgroundColor={colors.primaryColor} />

      <CustomModal
        isVisible={deletJobModal} 
        imageSource={require('../../../assets/warning.png')}
        message='Are you sure you want to delete this job.'
        onPressYes={() => {
          deleteSaveJob(deleteJobId)
          setDeleteJobModal(false)
        }}
        onPressNo={() => setDeleteJobModal(false)}
      />

      <CustomModal
        type={'confirmation'}
        isVisible={confirmDeletedModal} 
        imageSource={require('../../../assets/checked.png')}
        message='Job is Deleted.'
        buttonText='Ok'
        onPressOk={() => {
          setConfirmDeletedModal(false)
          navigation.navigate(Constants.screen.EmployeeDashboard)
        }}
      />

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={{ flex: 1 }}>

        <HeaderImage style={{ height: Dimensions.get('window').height * 0.22 }} />

        <View style={{ position: 'absolute', width: '100%', padding: 9 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <MenuIcon onPress={() => navigation.openDrawer()}/>

            <ScreenTitle title='Save Jobs' />

            <LanguagePicker
              viewStyle={{ width: 80 }}
              containerStyle={{ flex: 1 }}
              value={lang}
              setValue={setLang}
              open={dropDown}
              setOpen={setDropDown}
            />

          </View>

          <SearchField 
            value={searchJob}
            onChangeText={setSearchJob}
          />
          
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={searchSaveJob}
          keyExtractor={(key, index) => index.toString()}
          renderItem={jobCard}
          refreshControl={
            <RefreshControl 
              refreshing={loader}
              onRefresh={getSavedJobsList}
            />
          }
        />

        {/* <Button
          title='See More'
          style={styles.seeMoreButton}
          titleStyle={{ fontSize: 12 }}
        /> */}

      </ImageBackground>

    </View>
    :
    <View style={{backgroundColor: colors.pureWhite, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image source={require('../../../assets/noData.jpg')} resizeMode='contain' style={{height: 300, width:400}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 165,
    width: '100%'
  },
  jobContainer: {
    marginVertical: 4,
    padding: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
  },
  jobImage: {
    height: 120,
    width: 120,
    borderRadius: 15
  },
  jobImage: {
    height: 120,
    width: 120,
    borderRadius: 15
  },
  manageJobButton: {
    borderRadius: 20,
    marginLeft: 6,
    backgroundColor: colors.darkGray,
    height: Dimensions.get('window').height * 0.05,
    width: 90
  },
  jobTitle: {
    color: colors.primaryColor,
    fontSize: 16,
    fontWeight: 'bold'
  },
  findJobChip: {
    flex: 0.4,
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: colors.yellow,
    flexDirection: 'row',
    borderRadius: 20
  },
  seeMoreButton: {
    height: Dimensions.get('window').height * 0.05,
    marginVertical: 5,
    backgroundColor: colors.primaryColor,
    padding: 3,
    alignSelf: 'center'
  },
  jobIconsContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icons: {
    marginLeft: 6,
    alignItems: 'center'
  },
})

export default SavedJobs;