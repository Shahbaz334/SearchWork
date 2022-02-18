import {StyleSheet, Text, View} from 'react-native';
import React,{useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';

const CustomDrop = ({data , onSelect ,defaultButtonText}) => {
  
  const [count , setCount]=useState(data)
  console.log('CustomDrop data',data);
  return (
    <View>
      <SelectDropdown
        buttonStyle={styles.drowpDownDesign}
        defaultButtonText={defaultButtonText}
        data={count}
        dropdownIconPosition='right'
        renderDropdownIcon={()=>{

        }}
        onSelect={(selectedItem, index,) => {
         console.log(selectedItem,index);
        onSelect(selectedItem,index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return (item);
        }}
      />
    </View>
  );
};

export default CustomDrop;

const styles = StyleSheet.create({
    drowpDownDesign:{
        backgroundColor:"white",
        width:'90%',
        alignSelf:'center',
        borderRadius:10,
        borderWidth:2,
        borderColor:'black',
        margin:10
        }
});