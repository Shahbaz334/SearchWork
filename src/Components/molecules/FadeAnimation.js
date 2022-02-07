import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const FadeAnimation = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current 

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View style={{...props.style, opacity: fadeAnim }}>
      {props.children}
    </Animated.View>
  );
}

export default FadeAnimation;