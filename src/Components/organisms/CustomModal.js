export const type = {
  confirm: 'confirmation'
}

import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import colors from '../../Constants/colors';



const CustomModal = ({ isVisible, imageSource, type, message, buttonText, onPressOk, onPressYes, onPressNo}) => {
  return (
    <Modal isVisible={isVisible} animationIn='fadeInRightBig' animationOut='fadeOutLeftBig'>

      <View style={styles.modalContainer}>

        <Image source={imageSource} resizeMode='contain' style={styles.icon} />

        <Text style={styles.modalText}>{message}</Text>

        {
          type == 'confirmation' ?

              <TouchableOpacity style={styles.button} onPress={onPressOk}>
                <Text style={styles.buttonText}>{buttonText ? buttonText : 'Ok'}</Text>
              </TouchableOpacity>
            :
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onPressYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{...styles.button, backgroundColor: colors.buttonColor}} onPress={onPressNo}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity >
            </View>
        }

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
    //backgroundColor: 'pink'
  },
  icon: {
    height: 60,
    width: 60,
    bottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 5
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

export default CustomModal;


