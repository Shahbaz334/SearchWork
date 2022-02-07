import {Picker} from '@react-native-picker/picker';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import colors from '../../Constants/colors';
import { strings } from '../../Language/i18n';

const StatePicker = ({selectedValue, onValueChange, items, pickerContainerStyle, pickerTitleStyle}) => {

  const data = items;

  return(
    <View style={pickerContainerStyle}>
      <Text style={[styles.pickerTitle, pickerTitleStyle]}>
        {strings("state")}
      </Text>

      <View style={styles.picker}>
        <Picker
          mode={'dropdown'}
          dropdownIconColor={colors.primaryColor}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          <Picker.Item label='Select State' value={0} style={{fontSize: 14}}/>
          {
            data.map((val, index) => (
              <Picker.Item
                style={{fontSize: 14}} 
                key={index}
                label={val.state}
                value={val.state}
              />
            ))
          }
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerTitle:{
    color: colors.primaryColor, 
    fontWeight: '700', 
    marginLeft: 7
  },
  picker:{
    marginTop: 4, 
    height: Dimensions.get('window').height * 0.065, 
    borderRadius: 15, 
    borderWidth: 1.5, 
    borderColor: colors.gray, 
    justifyContent: 'center' 
  },
});

export default StatePicker;