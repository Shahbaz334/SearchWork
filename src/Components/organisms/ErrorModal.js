import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import colors from '../../Constants/colors';


const ErrorModal = ({ isVisible, onPress, message}) => {
  return (
    <Modal isVisible={isVisible} animationIn='fadeInRightBig' animationOut='fadeOutLeftBig'>

      <View style={styles.modalContainer}>

        <Image source={require('../../../assets/warning.png')} resizeMode='contain' style={styles.icon} />

        <Text style={styles.modalText}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Ok</Text>
        </TouchableOpacity>

      </View>

    </Modal>
  )
}
const styles = StyleSheet.create({
  modalContainer: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 9
  },
  modalText: {
    fontSize: 15,
    fontWeight: '600',
    bottom: 15,
  },
  icon: {
    height: 60,
    width: 60,
    bottom: 30,
  },
  button: {
    backgroundColor: colors.primaryColor,
    width: 100,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white
  }
});

export default ErrorModal;


