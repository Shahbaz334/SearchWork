import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../Constants/colors';
import CompanyLabel from './CompanyLabel';

const CompanyLabelCard = () => {
  return (
    <View style={styles.container}>
      <CompanyLabel style={{ color: colors.white }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop: 'auto', 
    justifyContent: 'center', 
    height: 25, 
    backgroundColor: colors.primaryColor, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20
  }
});

export default CompanyLabelCard;