import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../../Constants/colors';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../molecules/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const JobItemCard = (imageUrl, jobTitle, saveIcon, iconButtondisabled, saveIconOnPress, editJobIconShow, onPressDelete, manageJobButtonProcees, saveIconName, jobDescription, manageJobIcons, viewIconOnPress, onPressEdit, manageJobOnPress) => {

  return (
    <View style={styles.jobContainer}>

      <View style={styles.jobImageContainer}>
        {
          imageUrl ?
           <Image source={imageUrl} style={{...StyleSheet.absoluteFillObject}}/>
          :
          <Image resizeMode='contain' source={require('../../../assets/logo.png')} style={styles.jobImage}/>
        }
      </View>

      <View style={{ marginLeft: 8, flex: 1 }}>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> 
        
        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.jobTitleStyle}>
          {jobTitle}
        </Text>

       
       {
         saveIcon == true ?
        <TouchableOpacity disabled={iconButtondisabled} onPress={saveIconOnPress}>
          <FontAwesome name={saveIconName} size={20} color={colors.darkGray} />
        </TouchableOpacity>
        : null
        }
        
        </View>

        <Text ellipsizeMode='tail' numberOfLines={3} style={{ fontSize: 12 }}>
          {jobDescription}
        </Text>

        {
          manageJobButtonProcees == true ?
        

        <View style={styles.jobIconsContainer}>
          {
            manageJobIcons == true ?
              <>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={viewIconOnPress}>
                  <Ionicons name='eye' size={18} color={colors.buttonColor} />
                  <Text style={{ fontSize: 10 }}>View</Text>
                </TouchableOpacity>

                {
                  editJobIconShow == true ?
              
                <TouchableOpacity style={styles.icons} onPress={onPressEdit}>
                  <MaterialCommunityIcons name='file-document-edit' size={18} color={colors.primaryColor} />
                  <Text style={{ fontSize: 10 }}>Edit</Text>
                </TouchableOpacity>

                : null
                }

                <TouchableOpacity style={styles.icons} onPress={onPressDelete}>
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
            onPress={manageJobOnPress}
          />

        </View>
        : null
      }

      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  jobContainer: {
    marginBottom: 10,
    padding: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
    backgroundColor: colors.white,
    flexDirection: 'row'
  },
  jobImageContainer: {
    overflow: 'hidden',
    height: 120,
    width: 120,
    borderRadius: 15,
    backgroundColor: colors.primaryColorLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  jobImage: {
    height: 100,
    width: 100,
  },
  jobTitleStyle:{
    color: colors.darkGray, 
    fontSize: 16, 
    fontWeight: 'bold', 
    flex: 1, 
    marginRight: 5
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
  manageJobButton: {
    borderRadius: 20,
    marginLeft: 6,
    backgroundColor: colors.darkGray,
    height: Dimensions.get('window').height * 0.05,
    width: 90
  },
});


export default JobItemCard; 
