import React, { useState } from "react";
import { View, Text, FlatList, ImageBackground, Image, StyleSheet, StatusBar, Dimensions, TouchableOpacity } from "react-native";
import colors from "../../Constants/colors";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Divider from '../../Components/atoms/Divider';
import Button from "../../Components/molecules/Button";
import Constants from '../../Constants/Constants.json';
import NoData from "../../Components/organisms/NoData";
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import { getProfile, loginUserProfile } from "../../redux/slices";
import { useSelector, useDispatch } from 'react-redux';
import Loader from "../../Components/atoms/Loader";
import ErrorModal from "../../Components/organisms/ErrorModal";
import { strings } from '../../Language/i18n'

const Applicants = ({ navigation, route }) => {

  const [loader, setLoader] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const userProfile = useSelector(loginUserProfile);

  const { appliedUser } = route.params;

  async function applicantProfile(userId) {

    setLoader(true)

    let queryParams = {
      id: userId
    }

    try {
      var apiResult = await apiCall(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.ViewProfile,
        {},
        queryParams
      )

      if (apiResult.isAxiosError == true) {
        setErrorMessage(apiResult.response.data.error.messages.map(val => val + '\n'))
        setErrorModal(true)
        setLoader(false)
      }
      else {
        dispatch(getProfile(apiResult.data.response.data[0]))
        setLoader(false)
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

  
  const ApplicantsList = ({ item }) => {
    return (
      <View style={styles.applicantContainer}>

        {
          item.image ?
            <Image source={{ uri: item.image }} style={{ height: 40, width: 40, borderRadius: 20 }} />
            :
            <View style={{ backgroundColor: colors.lightGray, height: 30, width: 30, borderRadius: 15 }}>
              <FontAwesome name='user' size={25} color={colors.white} style={{ marginLeft: 6 }} />
            </View>
        }

        <Text style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 18, color: colors.white, width: 160 }}>{item.name}</Text>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.resumeButton}
          onPress={() => {
            applicantProfile(item.id)
            navigation.navigate(Constants.screen.Resume)
          }}
        >
          <Text style={{ fontWeight: 'bold', padding: 8 }}>{strings("ViewResume")}</Text>
        </TouchableOpacity>

      </View>
    )
  }

  const Separator = () => {
    return (
      <Divider style={{ width: '80%', alignSelf: 'center', marginVertical: 5 }} />
    )
  }



  return (
    // {
    appliedUser.length > 0 ?

      <View style={{ flex: 1 }}>

        <StatusBar backgroundColor={colors.primaryColor} />

        <ErrorModal
          isVisible={errorModal}
          message={errorMessage}
          onPress={() => setErrorModal(false)}
        />

        <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>


          <View style={styles.container}>

            <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 5 }} onPress={() => navigation.goBack()}>
              <AntDesign name='closesquare' size={22} color={colors.primaryColor} />
            </TouchableOpacity>

            <Text style={styles.applicantName}>View Applicants</Text>

            <View style={styles.flatListContainer}>
              {userProfile?.vip_expire ?
              <View style={{backgroundColor:"blue"}}> 
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={appliedUser}
                  //data={applicants}
                  keyExtractor={(key, index) => index.toString()}
                  renderItem={ApplicantsList}
                  ItemSeparatorComponent={Separator}
                /> </View>:


                <>
                <View >
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={appliedUser.slice(0, 3)}
                    //data={applicants}
                    keyExtractor={(key, index) => index.toString()}
                    renderItem={ApplicantsList}
                    ItemSeparatorComponent={Separator}
                  />
                  </View>
                  {appliedUser.length > 3 ?  <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>
                  <View style={{width:370,alignItems:"center", height:250,marginBottom:120}}>
                 <Text style={styles.textName}>  You have basic</Text>
                 <Text style={styles.textName}>  Account kindly</Text>
                 <Text style={styles.textName}>  Upgrade Your </Text>
                 <Text style={styles.textName}> account For see </Text>
                 <Text style={styles.textName}>  All Applicants</Text>
                  <View></View>
                  <Button
                  onPress={()=>{navigation.navigate(Constants.screen.Payment_Screen)}}
            title='Upgrade'
            style={styles.seeMoreButton}
          />
          </View>
                    {/* <View>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={appliedUser.filter((item,index)=> index > 0)}
                      //data={applicants}
                      keyExtractor={(key, index) => index.toString()}
                      renderItem={ApplicantsList}
                      ItemSeparatorComponent={Separator}
                    />
                    
                    </View> */}
              
                    </ImageBackground> : null}
                </>

              }
            </View>

          </View>

          {/* <Button
            title='See More'
            style={styles.seeMoreButton}
          /> */}

        </ImageBackground>

      </View>
      : <NoData />
    // }
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    borderRadius: 10,
    backgroundColor: colors.white,
    width: Dimensions.get('window').width * 0.89,
    height: Dimensions.get('window').height * 0.71,
    alignItems: 'center'
  },
  applicantContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
  },
  applicantName: {
    fontSize: 20,
    color: colors.primaryColor,
    fontWeight: 'bold',
    bottom: 15
  },
  textName: {
    fontSize: 20,
    color: colors.primaryColor,
    fontWeight: 'bold',
    bottom: 5
  },
  

  resumeButton: {
    backgroundColor: colors.yellow,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 4
  },
  flatListContainer: {
    width: Dimensions.get('window').width * 0.89,
    height: Dimensions.get('window').height * 0.7,
  },
  seeMoreButton: {
    marginTop: 10,
    
    backgroundColor: colors.primaryColor,
    padding: 10,
    height:70,
    width:160,
    borderRadius:40
  }
});

export default Applicants;