import React, { useRef, useEffect } from 'react';
import { Animated, Text, View, Dimensions, Image, StatusBar, StyleSheet } from 'react-native';
import CompanyLabel from '../Components/atoms/CompanyLabel';
import colors from '../Constants/colors';

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:
const ModalScreen = () => {
  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
    //     <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
    //   </FadeInView>
    // </View>

    <View style={{flex: 1}}>
      <StatusBar backgroundColor={colors.primaryColor} />

      <Image source={require('../../assets/bgUp.jpg')} style={styles.image}/>

      <View style={styles.logoContainer}>

        {/* <FadeInView source={require('../../assets/logo.png')} style={styles.logo}/> */}

        <FadeInView>
          <Image resizeMode='contain' source={require('../../assets/logo.png')} style={styles.logo} />
          <CompanyLabel style={{ color: colors.white ,marginTop: 15}}/>
        </FadeInView>

      
      </View>

      <Image source={require('../../assets/bgDown.jpg')} style={styles.image}/>

    </View>

  )
}


const styles = StyleSheet.create({
  logoContainer:{
    backgroundColor: colors.primaryColor, 
    flex: 0.5, 
    borderWidth: 1.5, 
    borderColor:colors.white, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  image:{
    flex: 1, 
    width: '100%'
  },
  logo:{
    flex: 0.9,
    width: Dimensions.get('window').width * 0.75,
  },
});

export default ModalScreen;