import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import LocalStrings from '../../Language/Strings'
import ModalDropdown from 'react-native-modal-dropdown';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setLanguageSelected } from '../../redux/slices';

const items = [
  {
    label: 'English',
    value: 'en',
    icon: require('../../../assets/usa.png')
  },
  {
    label: 'Spanish',
    value: 'sp',
    icon: require('../../../assets/spain.png')
  },
]

const LanguagePicker = () => {
  // Redux
  let selectedLang = useSelector(setLanguageSelected)
  // console.log('============',selectedLang)
  const dispatch = useDispatch();
  // Local State
  const [isOpen, setIsOpen] = React.useState(false)
  const [lang, setLang] = React.useState(selectedLang === 'en' ? 'English' : 'Spanish')

  return (
    <ModalDropdown
      options={items}
      defaultValue = {lang}
      style = {[styles.btnContainer, {
        borderBottomLeftRadius: isOpen ? 0 : 25,
        borderBottomRightRadius: isOpen ? 0 : 25,
      }]}
      textStyle = {[styles.textStyle, {
        borderBottomLeftRadius: isOpen ? 0 : 25,
        borderBottomRightRadius: isOpen ? 0 : 25,
      }]}
      dropdownStyle = {styles.dropdownStyle}

      renderRow={(data) => {
        return (
          <TouchableOpacity style = {styles.row} onPress={() => {
            setLang(data.label)
            LocalStrings.setLanguage(data.value)
            dispatch(setLanguage(data.value))
            
          }}>
            <Image source={data.icon} style = {styles.iconImage} />
            <Text style = {{paddingHorizontal: 5}}>{data.label}</Text>
          </TouchableOpacity>
        )
      }}

      onDropdownWillShow = {() => {
        setIsOpen(true)
      }}

      onDropdownWillHide = {() => {
        setIsOpen(false)
      }}
    />
  )
}

const styles = StyleSheet.create({
  btnContainer: {
    width: 100,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },

  textStyle: {
    width: 98,
    fontSize: 14,
    height: 49,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    textAlign: "center",
    textAlignVertical: 'center',
  },

  dropdownStyle: {
    height: 80,
    width: 100,
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 2,
  },

  iconImage: {
    height: 16,
    width: 20,
    paddingHorizontal: 15
  },

  row: {
    width: 85,
    flexDirection: 'row',
    paddingVertical: 5,
    marginVertical: 2
  }
});

export default LanguagePicker;
