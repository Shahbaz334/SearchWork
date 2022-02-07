import React, {useState} from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, StyleSheet, StatusBar, Dimensions } from 'react-native';
import colors from '../../Constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Constants from '../../Constants/Constants.json';
import SearchField from '../../Components/molecules/SearchField';
import { useFocusEffect } from '@react-navigation/native';

const JobCategoryList = ({navigation, route}) => {

  const [searchCatgeory, setSearchCategory] = useState('');
  const [endLimit, setEndLimit] = useState(5);


  const {val} = route.params;

  var jobSubCategory;
  if(searchCatgeory != ''){
    jobSubCategory = val.subcategories.filter((value) => (
      value.name.toLowerCase().includes(searchCatgeory.toLowerCase())
    ))
  }
  else{
    jobSubCategory = val.subcategories
  }


  const jobCategory = ({item}) => {
    return(
      <TouchableOpacity 
        style={styles.categoryTypeContainer}
        onPress={() => navigation.navigate(Constants.screen.JobListing, {
          jobSubCategoryId: item.id, 
          jobCategoryId: val.category_id_decode
        })}
      >
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  useFocusEffect(
    React.useCallback(()=> {
      setEndLimit(5);
    }, [])
  )

  return (
    <View style={{ flex: 1 }}>
      
      <StatusBar backgroundColor={colors.primaryColor} />

      <ImageBackground source={require('../../../assets/blurBg.png')} style={styles.bg}>

        <View style={styles.CategoryContainer}>

          <TouchableOpacity 
            style={{alignSelf: 'flex-end', marginRight: 3}}
            onPress={() => navigation.goBack()}
          >
            <Entypo 
              name='squared-cross' 
              size={20} 
              color={colors.buttonColor}   
            />
          </TouchableOpacity>

          <SearchField 
            style={{marginHorizontal: 10, marginTop: 7, marginBottom: 10}} 
            textStyle={{fontSize: 13}}
            placeholder='Search Category'
            value={searchCatgeory}
            onChangeText={(val) => {
              setSearchCategory(val)
              setEndLimit(5)
            }}
          />
        
        <View style={styles.flatListContainer}>
          <FlatList
            data={jobSubCategory.slice(0,endLimit)} 
            renderItem={jobCategory}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        
        {
          jobSubCategory.slice(endLimit,).length > 0 ?
  
          <TouchableOpacity onPress={() => {
             setEndLimit(jobSubCategory.length)
          }}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        : null
        }

        </View>

      </ImageBackground>

    </View>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  CategoryContainer: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  categoryTypeContainer: {
    marginVertical: 7,
    elevation: 5,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 15,
    width: Dimensions.get('window').width * 0.9
  },
  categoryText:{
    fontWeight: 'bold', 
    fontSize: 16, 
    color: colors.primaryColor
  },
  seeAllButton:{
    marginTop: 6, 
    color: colors.buttonColor, 
    fontWeight: 'bold', 
    fontSize: 16, 
    textDecorationLine: 'underline'
  },
  flatListContainer:{
    backgroundColor: 'transparent', 
    width: Dimensions.get('window').width * 0.92, 
    height: Dimensions.get('window').height * 0.38
  }
});

export default JobCategoryList;