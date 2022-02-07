
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../Constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Payme = () => {
  return (<View style={{ alignItems: 'center', }}>
        

  <View style={styles.main_div}>
      <View style={styles.text1}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Basic</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>10$/User</Text>
      </View>
      <View style={{ borderWidth: 1, borderBottomColor: 'black', width: 120, marginHorizontal: 35, }}></View>

      <View style={{ marginTop: 15, alignItems: 'center' }} >
          <View style={{ flexDirection: 'row', marginHorizontal: 5, }}>
              <AntDesign name='checkcircle' size={20} color={'black'} />
              <Text style={{ textAlign: 'center', marginHorizontal: 5 }}>sjdnkjsnkjbklbsldkj</Text>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
              <AntDesign name='checkcircle' size={20} color={'black'} />
              <Text style={{ textAlign: 'center', marginHorizontal: 5 }}>sjdnkjsnkbasljdbsj</Text>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 5,width:145 }}>
              <AntDesign name='checkcircle' size={20} color={'black'} />
              <Text style={{ textAlign: 'center', marginHorizontal: 5 }}>chghgjv</Text>
          </View>
      </View>


      <View style={{ justifyContent: 'center' }}>
          <TouchableOpacity style={styles.Subs} color={colors.buttonColor} onPress={()=>props.navigation.navigate('Payment_Card',{package_id:1})}>
              <Text style={{ textAlign: 'center' }} color={colors.primaryColor}>Subscribe</Text>
          </TouchableOpacity>
      </View>

  </View>



</View>
   
  );
};

export default Payme;

const styles = StyleSheet.create({
  main_div: {
    width: 200,
    height: 220,
    borderWidth: 1,
    marginTop: 10,
    borderColor: 'black',
    backgroundColor: 'yellow',
    borderRadius: 15,
},
Subs: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 50,
    width: 90,
    height: 30,
    padding: 3,


},
text1: {
    margin: 15

}

});
