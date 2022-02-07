import React, {useState, useCallback} from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, Image, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import HeaderImage from '../../Components/atoms/HeaderImage';
import MenuIcon from '../../Components/atoms/MenuIcon';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import ScreenTitle from '../../Components/atoms/ScreenTitle';
import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Divider from '../../Components/atoms/Divider';
import IconText from '../../Components/atoms/IconText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../Components/molecules/Button';
import Foundation from 'react-native-vector-icons/Foundation';
import CompanyLabelCard from '../../Components/atoms/CompanyLabelCard';
import {getViewJob, jobViewDetails} from '../../redux/slices';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import Loader from '../../Components/atoms/Loader';
import LocalStrings from '../../Language/Strings';
import { strings } from '../../Language/i18n';

const ViewJob = ({navigation}) => {

  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);

  const dispatch = useDispatch();

  const jobDetails = useSelector(jobViewDetails);

  return(
    <ScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}>

      <StatusBar backgroundColor={colors.primaryColor}/>

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>

        <View style={{height: 835}}>

      <HeaderImage style={{height: Dimensions.get('window').height * 0.23}}/>

        <HeaderRowContainer>

          <MenuIcon onPress={() => navigation.openDrawer()}/>

          <ScreenTitle title='Job View'/>

          <LanguagePicker
            viewStyle={{width: 80}}
            containerStyle={{ flex: 1 }}
            value={lang}
            setValue={setLang}
            open={dropDown}
            setOpen={setDropDown}
          />

        </HeaderRowContainer>

        <View style={styles.JobContainer}>
            
            <Image source={jobDetails.image_urls ? {uri:jobDetails.image_urls['3x']} : require('../../../assets/people.jpg')} style={styles.image} />

            <TouchableOpacity style={{ position: 'absolute', top: 12, left: 12 }} onPress={() => navigation.goBack()}>
              <Ionicons name='arrow-back-circle' size={30} color={colors.darkGray}/>
            </TouchableOpacity>

            <View style={styles.jobTitleContainer}>
          
              <Text style={{fontSize: 22, fontWeight: 'bold', color: colors.primaryColor}}>{jobDetails.employername['name']}</Text>

            </View>

            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between' }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='document-text-sharp' size={25} color={colors.primaryColor} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>{LocalStrings.JobDescription}</Text>
              </View>


              {
                jobDetails.no_of_posts ?
              

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                
                <View style={{flexDirection: 'row'}}>
                  <Text style={{ marginRight: 2, color: colors.gray }}>No of Posts:</Text>
                  <Text style={{fontWeight: 'bold'}}>{jobDetails.no_of_posts && jobDetails.no_of_posts}</Text>
                </View>
                
                <Ionicons name='people' size={25} color={colors.primaryColor} style={{marginLeft: 3}}/>

              </View>
            : null}

            </View>

              <Text style={{paddingLeft: 15, paddingRight: 15}}>
                {jobDetails.description}
              </Text>

              <Divider style={{marginLeft: 15, marginTop: 15, width: '90%'}}/>

              <IconText style={{alignItems: 'center'}} text={LocalStrings.Designation} textStyle={styles.smallInfoHeading}>
                <MaterialIcons name='person' size={25} color={colors.primaryColor}/>
              </IconText>

              <Text style={{marginLeft: 35, marginTop: 2, color: colors.gray}}>{jobDetails.title}</Text>

              <Divider style={{marginLeft: 15, marginTop: 15, width: '90%'}}/>

              <IconText style={{alignItems: 'center'}} text={LocalStrings.Location} textStyle={styles.smallInfoHeading}>
                <Ionicons name='location-sharp' size={25} color={colors.primaryColor}/>
              </IconText>

              <Text 
                numberOfLines={2} 
                ellipsizeMode='tail' 
                style={{marginLeft: 35, marginTop: 2, marginRight: 9, color: colors.gray}}
              >
                {`${jobDetails.st_address}, ${jobDetails.city}, ${jobDetails.state}, ${jobDetails.zipcode}`}
              </Text>          
              
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
              
              <TouchableOpacity 
                style={{marginLeft: 35}}
                onPress={() => Linking.openURL(`https://www.google.com/maps/search/${jobDetails.st_address}, ${jobDetails.city}, ${jobDetails.state}, ${jobDetails.zipcode}`)
                .catch(err => console.error('An error occurred', err))
              } 
              >
                <Text style={{fontSize: 12, color: colors.buttonColor}}>Click here to view full address</Text>
              </TouchableOpacity>
              <MaterialIcons name='location-city' size={20} color={colors.primaryColor} style={{marginLeft: 3}}/>

            </View>

            <Divider style={{marginLeft: 15, marginTop: 15, width: '90%'}}/>

            <IconText style={{alignItems: 'center', marginLeft: 7}} text={LocalStrings.HourlyPay} textStyle={{...styles.smallInfoHeading, marginLeft: 6}}>
                <Foundation name='dollar' size={25} color={colors.primaryColor}/>
            </IconText>

            <Text style={{marginLeft: 35, marginTop: 2, color: colors.gray, marginBottom: 10}}>{jobDetails.hourly_pay}</Text>

          </View>

          </View>

          <CompanyLabelCard />
          

          </ImageBackground>
        
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bg:{
    height: Dimensions.get('window').height + 80
  },
  JobContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: 15,
    marginHorizontal: 15,
    bottom: 95,
  },
  jobTitleContainer:{
    backgroundColor: colors.white, 
    padding: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    elevation: 20
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  smallInfoHeading:{
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: 14
  }
})

export default ViewJob;