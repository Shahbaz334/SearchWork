import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../Constants/colors';

const InputField = ({ style, textStyle, onSubmitEditing, inputFieldStyle, numberOfLines, onEndEditing, textFieldStyle, editable,onFocus, autoCapitalize, maxLength, multiline, title, iconName, placeholder, keyboardType, value, onChangeText, secureTextEntry }) => {
  return (
    <View style={[styles.container, style]}>

      <Text style={[styles.text, textStyle]}>{title}</Text>

      <View style={[styles.fieldContainer, inputFieldStyle]}>

        <Ionicons
          name={iconName}
          size={18}
          color={colors.gray}
          style={{ marginLeft: 10 }}
        />

        <TextInput
          style={[styles.inputFied, textFieldStyle]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          onEndEditing={onEndEditing}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          selectTextOnFocus={onFocus}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  text: {
    color: colors.primaryColor,
    fontWeight: '700',
    marginLeft: 7
  },
  fieldContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1.5,
    height: Dimensions.get('window').height * 0.065
  },
  inputFied: {
    marginLeft: 3,
    flex: 0.96,
  },

});

export default InputField;
