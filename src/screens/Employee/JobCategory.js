import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderImage from '../../Components/atoms/HeaderImage';
import MenuIcon from '../../Components/atoms/MenuIcon';
import ScreenTitle from '../../Components/atoms/ScreenTitle';
import SearchField from '../../Components/molecules/SearchField';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import colors from '../../Constants/colors';
import Feather from 'react-native-vector-icons/Feather';


const JobCategory = ({ navigation }) => {

  const [lang, setLang] = useState('eng');
  const [dropDown, setDropDown] = useState(false);

  const data = [
    {image: require('../../../assets/people.jpg'), jobTitle: 'Food/Beverage/Hospitality'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'Retail/Wholesale'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'Construction'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'Landscaping'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'General Labor'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'Transport'},
    {image: require('../../../assets/people.jpg'), jobTitle: 'Warehouse'},
  ]

  const jobCategroy = ({item}) => {
    return(
      <TouchableOpacity style={styles.categoryContainer} activeOpacity={0.6}>
        <Image source={item.image} style={styles.jobIcon}/>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <MaterialIcons name='arrow-forward-ios' size={20} style={styles.forwardIcon} color={colors.white}/>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1 }}>

      <StatusBar backgroundColor={colors.primaryColor} />

      <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bgContainer}>

        <HeaderImage style={{ height: Dimensions.get('window').height * 0.22 }} />

        <View style={{ position: 'absolute', width: '100%', padding: 9 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <MenuIcon onPress={() => navigation.openDrawer()} />

            <ScreenTitle title='Job Category' />

            <LanguagePicker
              viewStyle={{ width: 80 }}
              containerStyle={{ flex: 1 }}
              value={lang}
              setValue={setLang}
              open={dropDown}
              setOpen={setDropDown}
            />

          </View>

          <SearchField />

        </View>

      {/* <View style={{flex: 0}}> */}
        <FlatList
          style={{backgroundColor: 'pink'}}
          showsVerticalScrollIndicator={false} 
          data={data}
          keyExtractor={(key, index) => index.toString()}
          renderItem={jobCategroy}
        />
      {/* </View> */}

        <Feather name='chevrons-down' size={20} color={colors.primaryColor} style={{marginBottom: 'auto'}}/>

      </ImageBackground>

    </View>
  )
}


const styles = StyleSheet.create({
  bgContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  categoryContainer:{
    flexDirection: 'row', 
    borderRadius: 25, 
    alignItems: 'center', 
    backgroundColor: colors.primaryColor, 
    margin: 5, 
    padding: 5
  },
  jobIcon:{
    height: 40, 
    width: 40, 
    borderRadius: 20
  },
  jobTitle:{
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.white, 
    marginLeft: 10, 
    flex: 1
  },
  forwardIcon:{
    marginLeft: 'auto', 
    marginRight: 7
  }
})

export default JobCategory


