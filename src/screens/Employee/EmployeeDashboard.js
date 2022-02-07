import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useDispatch, useSelector } from 'react-redux';
import HeaderImage from '../../Components/atoms/HeaderImage';
import Loader from '../../Components/atoms/Loader';
import Logo from '../../Components/atoms/Logo';
import MenuIcon from '../../Components/atoms/MenuIcon';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import ErrorModal from '../../Components/organisms/ErrorModal';
import JobCard from '../../Components/organisms/JobCard';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Constants from '../../Constants/Constants.json';
import { getJobCategory, getJobList, getLoggedInProfile, getViewJob, jobsCategoryList, jobsListing,setLanguageSelected } from '../../redux/slices';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';


const EmployeeDashboard = ({navigation}) => {
  let selectedLang = useSelector(setLanguageSelected)


  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);

  const dispatch = useDispatch();

  const jobsCategory = useSelector(jobsCategoryList);
  const jobsData = useSelector(jobsListing);
  
  const jobs = jobsData?.data
  const recentJobs = jobs?.slice(0, 3)

  const dashboardSlideImages = [
    {image: require('../../../assets/people.jpg')},
    {image: require('../../../assets/slider.png')},
    {image:require('../../../assets/bgSlide.jpg')}
  ]


 useFocusEffect(
   React.useCallback(() => {


    async function getJobsCategory(){
      setLoader(true)
      if(jobsCategory  != undefined){
        setLoader(false)
      }

      try{
        var response = await apiCall(
          ApiConstants.methods.GET, 
          ApiConstants.endPoints.JobsCategory,
        );

        if(response.isAxiosError == true){
          console.log('Job Category:',response.response.data.error.messages.map(val => val + '\n'))
          setLoader(false)
        }
        else{
          dispatch(getJobCategory(response.data.response.data))
          setLoader(false)
        }
      }
      catch(error){
        alert(ApiConstants.apiMessage.Network_Error);
        setLoader(false)
      }
    }

    async function getJobsList(){
      setLoader(true)

      if(jobs != undefined){
        setLoader(false)
      }

      try{
        var apiResponse = await apiCall(
          ApiConstants.methods.GET, 
          ApiConstants.endPoints.JobsList,
        );

        if(apiResponse.isAxiosError == true){
          console.log('Job Data List Axios Error') 
          setLoader(false)
        }
        else{
          console.log("Jobs List....", apiResponse.data.response)
          dispatch(getJobList(apiResponse.data.response))
          setLoader(false)
        }
      }
      catch(error){
        console.log(ApiConstants.apiMessage.Network_Error);
        setLoader(false)
      }
    }

    async function getUserProfile(){
      //setLoader(true)

      try{
        var response = await apiCall(
          ApiConstants.methods.GET, 
          ApiConstants.endPoints.LoggedInUserProfile,
        );

        if(response.isAxiosError == true){
          setErrorMessage(response.response.data.error.messages.map(val => val+'\n'))
          setErrorModal(true)
          setLoader(false)
        }
        else{
          dispatch(getLoggedInProfile(response.data.response.data))
          setLoader(false)
        }
      }
      catch(error){
        console.log(ApiConstants.apiMessage.Network_Error);
        setLoader(false)
      }
    }

    getJobsCategory();
    getJobsList();
    getUserProfile();
   }, [])
 )

  if(loader == true){
    return(
      <Loader />
    )
  }


  return(
    <ScrollView
    screenProps={{selectedLang}}
    style={{flex: 1}} showsVerticalScrollIndicator={false}>

      <StatusBar backgroundColor={colors.primaryColor}/>

      <ErrorModal 
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bgContainer}>

        <HeaderImage style={{height: Dimensions.get('window').height * 0.21}}/>

      <HeaderRowContainer>
        <View>
          <MenuIcon onPress={() => navigation.openDrawer()}/>
          <Logo />
        </View>

        <LanguagePicker
          viewStyle={{width: 80}}
          containerStyle={{ flex: 1 }}
          value={lang}
          setValue={setLang}
          open={dropDown}
          setOpen={setDropDown}
        />

      </HeaderRowContainer>

      <View style={{height: 145}}>
        <Swiper
          containerStyle={{flex: 1}}
          showsPagination={false}
          autoplay={true}
          autoplayTimeout={3}
        >
          {
            dashboardSlideImages.map((val, index) => (
              <View key={index} style={styles.slide}>
                <Image 
                  source={val.image}
                  style={styles.slideImage}
                />
              </View>
            ))
          }
        </Swiper>
      </View>

      
        <View style={{top: -10, borderRadius: 15, backgroundColor: colors.primaryColor, padding: 5, alignItems: 'center', marginHorizontal: 60}}>
          <Text style={{fontWeight: 'bold', color: colors.white}}>Discover By Industries</Text>
        </View>
       
        <Swiper
          containerStyle={{height: 275, marginBottom: 10}}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={{ marginBottom: -20 }}
        >
          <View style={styles.jobGridContainer}>
            {
              jobsCategory?.slice(0,9).map((val, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.jobIconContainer}
                  onPress={() => {
                    if(val.subcategories != null){
                      navigation.navigate(Constants.screen.JobCategoryList, {val}) 
                    }
                    else{
                      navigation.navigate(Constants.screen.JobListing, {jobCategoryId: val.category_id_decode, jobSubCategoryId: 0})
                    } 
                  }}
                >
                  <View style={styles.iconContainer}>
                  <Image 
                    source={val.image_urls ? { uri: val.image_urls['1x'] } : require('../../../assets/logoGreen.png')}
                    style={styles.jobImage}  
                    resizeMode='contain' 
                  />
                  </View>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.jobIconText}>{val.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>

          <View style={styles.jobGridContainer}>
            {
              jobsCategory?.slice(9,).map((val, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.jobIconContainer}
                  onPress={() => {
                    if(val.subcategories != null){
                      navigation.navigate(Constants.screen.JobCategoryList, {val})
                    }
                    else{
                      navigation.navigate(Constants.screen.JobListing, {
                        jobCategoryId: val.category_id_decode, 
                        jobSubCategoryId: 0
                      }
                      )
                    }}}     
                >
                  <View style={styles.iconContainer}>
                  <Image 
                    source={{ uri: val.image_urls['1x'] }}
                    style={styles.jobImage}  
                    resizeMode='contain' 
                  />
                  </View>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.jobIconText}>{val.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </Swiper>

      <View style={{marginHorizontal: 15}}>
        
        <View style={{borderRadius:5, padding: 2, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primaryColor, alignItems: 'center'}}>
          <Text style={{marginLeft: 7, fontWeight: 'bold', color: colors.white}}>Most Recent</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(Constants.screen.AllJobsScreen)} 
            //</View>onPress={() => navigation.navigate(Constants.screen.JobListing)}
          >
            <Text style={{marginRight: 7, fontWeight: 'bold', color: colors.white, textDecorationLine: 'underline'}}>See All</Text>
          </TouchableOpacity>
        </View>

      </View>

      {
        recentJobs != undefined &&
        <View style={{height: 240, paddingVertical: 15}}>
          <Swiper
            containerStyle={styles.swiperContainerStyle}
            dot={<View style={styles.dot} />}
            activeDot ={ <View style={styles.activeDot} /> }
            paginationStyle={{bottom: -20}}
            loop={false}
          >
            {
              recentJobs.map((val, index) => (
                <View key={index} style={{alignItems: 'center'}}>
                  
                  <JobCard 
                    jobTitle={val.title}
                    imageSource={val.image_urls ? {uri: val.image_urls['3x']} : require('../../../assets/logo.png')} 
                    jobDescription={val.description}
                    duration={val.duration == 'full_time' ? 'Full-time' : 'Part-Time'}
                    location={`${val?.state}, ${val?.city}`}
                    onPress={()=>{
                      dispatch(getViewJob(val))
                      navigation.navigate(Constants.screen.IndividualJob)
                    }}
                  />
                </View>
              ))
            }
          </Swiper>
        </View>
      }

      {/* <View style={{height: 240, paddingVertical: 15}}>
        {
          <Swiper></Swiper>
        }
      </View> */}
    
    {/* <View style={{height: 240, paddingVertical: 15}}>
        <Swiper
          containerStyle={styles.swiperContainerStyle}
          dot={<View style={styles.dot} />}
          activeDot ={ <View style={styles.activeDot} /> }
          paginationStyle={{bottom: -20}}
          loop={false}
        >

          <View style={{alignItems: 'center'}}>
            <JobCard 
              imageSource={jobs[0]?.image_urls ? {uri: jobs[0]?.image_urls['3x']} : require('../../../assets/logo.png')} 
              jobTitle={jobs[0]?.title}
              jobDescription={jobs[0]?.description}
              duration={jobs[0]?.duration == 'full_time' ? 'Full-time' : 'Part-Time'}
              location={`${jobs[0]?.state}, ${jobs[0]?.city}`}
            />
          </View>

          <View style={{alignItems: 'center'}}>
          <JobCard
            imageSource={jobs[1]?.image_urls ? {uri: jobs[1]?.image_urls['3x']} : require('../../../assets/logo.png')}   
            jobTitle={jobs[1]?.title}
            jobDescription={jobs[1]?.description}
            duration={jobs[1]?.duration == 'full_time' ? 'Full-time' : 'Part-Time'}
            location={`${jobs[1]?.state}, ${jobs[1]?.city}`}
          />
          </View>

          <View style={{alignItems: 'center'}}>
          <JobCard
            imageSource={jobs[2]?.image_urls ? {uri: jobs[2]?.image_urls['3x']} : require('../../../assets/logo.png')}   
            jobTitle={jobs[2]?.title}
            jobDescription={jobs[2]?.description}
            duration={jobs[2]?.duration == 'full_time' ? 'Full-time' : 'Part-Time'}
            location={`${jobs[2]?.state}, ${jobs[1]?.city}`}
          />
          </View>

        </Swiper>
      </View> */}

      </ImageBackground>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bgContainer:{
    flex: 1,
    paddingBottom: 12,
    width: Dimensions.get('window').width
  },
  radiusImage: {
    height: Dimensions.get('window').height * 0.25,
    width: '100%',
  },
  image:{
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
  },
  jobGridContainer:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  jobIconContainer:{
    alignItems: 'center', 
    justifyContent: 'center',
    width: 100,
    marginHorizontal: 5,
    marginBottom: 20 
  },
  iconContainer:{
    height: 50, 
    width: 50, 
    borderRadius: 25, 
    overflow:'hidden', 
    backgroundColor: colors.white, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  jobImage:{
    height: 40, 
    width: 40
  },
  jobIconText:{
    fontSize: 11, 
    marginTop: 2, 
    fontWeight: 'bold' 
  },
  slide:{
    width: '100%',
    flex: 1
  },
  slideImage:{
    flex: 1,
    width: '100%'
  },
  dot:{
    backgroundColor: colors.white, 
    width: 13, 
    height: 13, 
    borderRadius: 7,
    borderColor: colors.primaryColor,
    borderWidth: 1, 
    marginLeft: 7, 
    marginRight: 7
  },
  activeDot:{
    backgroundColor: colors.primaryColor, 
    width: 13, 
    height: 13, 
    borderRadius: 7,
    borderColor: colors.white,
    borderWidth: 1, 
    marginLeft: 7, 
    marginRight: 7
  },
  jobsCategoryContainer:{
    paddingVertical: 12, 
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  jobRowConatiner:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  swiperContainerStyle:{
    //marginHorizontal: 15, 
    justifyContent: 'center'
  },
  searchFieldConatiner: {
    paddingHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    borderRadius: 20,
    backgroundColor: colors.primaryColorLight
  },
});

export default EmployeeDashboard;