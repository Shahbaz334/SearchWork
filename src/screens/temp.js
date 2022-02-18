import React, { useEffect, useRef, useState } from "react";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import StripeService from "../../../../services/StripeService";
import { showMessage } from "react-native-flash-message";
import { connect } from "react-redux";
import StripePurchase from "../../../../components/StripePurchase";
import PaypalModal from "../paypal/index";
import colors from "../Constants/colors";
const PaymentScreen = (props) => {
  const [card, setCard] = useState("");
  const [date, setDate] = useState("");
  const [cardDetail, setCardDetail] = useState(props.route.params);
  const [tutorDetail, setTutorDetail] = useState(props.route.params.tutorData);
  const [activeRadio, setActiveRadio] = useState(true);
  const [loader, setLoader] = useState(false);
  const { createToken, createPaymentMethod, handleCardAction } = useStripe();
  const [modalOpen, setModalOpen] = useState(false);

  //on change Paypal modal

  const onChangeModal = (message = null) => {
    setModalOpen(!modalOpen);
    if (message !== null) {
      if (message == "success") {
        showMessage({ message: "Payment Successfully!", type: "success" });
        props.navigation.navigate("PaymentSuccess", { check: false });
      } else {
        showMessage({
          message: "An error accoured while payment!",
          type: "danger",
        });
      }
    }
  };

  const getFormattedDate = (date) => {
    var todayTime = new Date(date);
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    var newMonth = month < 10 ? `0${month}` : month;
    var newDay = day < 10 ? `0${day}` : day;
    return year + "-" + newMonth + "-" + newDay;
  };

  console.log("=-=cardDetail=-", cardDetail);

  const cardSubmitTrialLesson = () => {
    let tokenid = "";
    console.log("card", card);
    setLoader(true);
    if (card === "") {
      showMessage({ message: "Please fill all the fields!", type: "danger" });
      setLoader(false);
    } else {
      showMessage({ message: "please Wait!", type: "warning" });
      console.log("heelo there");
      createPaymentMethod({ type: "Card", card: card })
        .then((res) => {
          console.log("res", res);
          tokenid = res.paymentMethod.id;
          console.log({
            student_id: props.authData.user_id,
            instructor_id: cardDetail.instructorId,
            time_slot: cardDetail.timeSlot,
            booked_date: getFormattedDate(cardDetail.timeDate),
            timezone: cardDetail.timeZone,
            appointment_status: "booked",
            gateway: "Stripe",
            currency: "GBP",
            price: cardDetail.price,
            payment_status: "paid",
            created: getFormattedDate(new Date()),
            token: res.paymentMethod.id,
          });
          StripeService.trialStripe({
            student_id: props.authData.user_id,
            instructor_id: cardDetail.instructorId,
            time_slot: cardDetail.timeSlot,
            booked_date: getFormattedDate(cardDetail.timeDate),
            timezone: cardDetail.timeZone,
            appointment_status: "booked",
            gateway: "Stripe",
            currency: "GBP",
            price: cardDetail.price,
            payment_status: "paid",
            created: getFormattedDate(new Date()),
            token: res.paymentMethod.id,
          })
            .then((res) => {
              console.log(res);
              setLoader(false);
              if (res.data[0].condition == "requires_action") {
                console.log("action require");
                setLoader(true);
                handleCardAction(res.data[0].data)
                  .then((responce) => {
                    console.log("intend id", responce.paymentIntent.id);
                    StripeService.trialStripe({
                      student_id: props.authData.user_id,
                      instructor_id: cardDetail.instructorId,
                      time_slot: cardDetail.timeSlot,
                      booked_date: getFormattedDate(cardDetail.timeDate),
                      timezone: cardDetail.timeZone,
                      appointment_status: "booked",
                      gateway: "Stripe",
                      currency: "GBP",
                      price: cardDetail.price,
                      payment_status: "paid",
                      created: getFormattedDate(new Date()),
                      token: tokenid,
                      payment_intent_id: responce.paymentIntent.id,
                    })
                      .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                          showMessage({
                            message: "Payment Successfully!",
                            type: "success",
                          });
                          props.navigation.navigate("PaymentSuccess", {
                            check: false,
                          });
                        } else {
                          showMessage({
                            message: "An error accoured while payment!",
                            type: "danger",
                          });
                        }
                      })
                      .catch((err) => {
                        setLoader(false);
                        showMessage({
                          message: "An error accoured while payment!",
                          type: "danger",
                        });
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    setLoader(false);
                    showMessage({
                      message: "An error accoured while payment!",
                      type: "danger",
                    });
                    console.log(err);
                  });
              } else {
                if (res.status == 200) {
                  showMessage({
                    message: "Payment Successfully!",
                    type: "success",
                  });
                  props.navigation.navigate("PaymentSuccess", { check: false });
                } else {
                  showMessage({
                    message: "An error accoured while payment!",
                    type: "danger",
                  });
                }
              }
            })
            .catch((err) => {
              setLoader(false);
              showMessage({
                message: "An error accoured while payment!",
                type: "danger",
              });
              console.log(err);
            });
        })
        .catch((err) => {
          setLoader(false);
          showMessage({
            message: "An error accoured while payment!",
            type: "danger",
          });
          console.log(err);
        });
    }
  };

  const cardSubmitPackage = () => {
    let tokenid = "";
    setLoader(true);
    if (card === "") {
      showMessage({ message: "Please fill all the fields!", type: "danger" });
    } else {
      showMessage({ message: "please Wait!", type: "warning" });

      createPaymentMethod({ type: "Card", card: card })
        .then((res) => {
          console.log("id", res.paymentMethod.id);
          tokenid = res.paymentMethod.id;
          console.log("stripe payload", {
            student_id: parseInt(props.authData.user_id),
            instructor_id: parseInt(cardDetail.packageSelected.user_id),
            instructor_package_id: parseInt(cardDetail.packageSelected.id),
            total_hours: parseInt(cardDetail.packageSelected.total_hours),
            amount:
              parseInt(cardDetail.packageSelected.pp_hour) *
              parseInt(cardDetail.packageSelected.total_hours),
            payment_status: "Paid",
            gateway: "Stripe",
            token: res.paymentMethod.id,
          });
          StripeService.packagePurchaseStripe({
            student_id: parseInt(props.authData.user_id),
            instructor_id: parseInt(cardDetail.packageSelected.user_id),
            instructor_package_id: parseInt(cardDetail.packageSelected.id),
            total_hours: parseInt(cardDetail.packageSelected.total_hours),
            amount:
              parseInt(cardDetail.packageSelected.pp_hour) *
              parseInt(cardDetail.packageSelected.total_hours),
            payment_status: "Paid",
            gateway: "Stripe",
            token: res.paymentMethod.id,
          })
            .then((res) => {
              console.log(res);
              setLoader(false);
              if (res.data[0].condition == "requires_action") {
                console.log("action require");
                setLoader(true);
                handleCardAction(res.data[0].data)
                  .then((responce) => {
                    console.log("intend id", responce.paymentIntent.id);
                    StripeService.packagePurchaseStripe({
                      student_id: parseInt(props.authData.user_id),
                      instructor_id: parseInt(
                        cardDetail.packageSelected.user_id
                      ),
                      instructor_package_id: parseInt(
                        cardDetail.packageSelected.id
                      ),
                      total_hours: parseInt(
                        cardDetail.packageSelected.total_hours
                      ),
                      amount:
                        parseInt(cardDetail.packageSelected.pp_hour) *
                        parseInt(cardDetail.packageSelected.total_hours),
                      payment_status: "Paid",
                      token: tokenid,
                      gateway: "Stripe",
                      payment_intent_id: responce.paymentIntent.id,
                    })
                      .then((res) => {
                        setLoader(false);
                        console.log(res);
                        if (res.data[0].error.status == 1) {
                          showMessage({
                            message: "An error accoured while payment!",
                            type: "danger",
                          });
                        } else {
                          showMessage({
                            message: "Payment Successfully!",
                            type: "success",
                          });
                          props.navigation.navigate("PaymentSuccess", {
                            check: false,
                          });
                        }
                      })
                      .catch((err) => {
                        setLoader(false);
                        showMessage({
                          message: "An error accoured while payment!",
                          type: "danger",
                        });
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    setLoader(false);
                    showMessage({
                      message: "An error accoured while payment!",
                      type: "danger",
                    });
                    console.log(err);
                  });
              } else {
                if (res.data[0].error.status == 1) {
                  showMessage({
                    message: "An error accoured while payment!",
                    type: "danger",
                  });
                } else {
                  showMessage({
                    message: "Payment Successfully!",
                    type: "success",
                  });
                  props.navigation.navigate("PaymentSuccess", { check: false });
                }
              }
            })
            .catch((err) => {
              setLoader(false);
              showMessage({
                message: "An error accoured while payment!",
                type: "danger",
              });
              console.log("stripe first hit", err);
            });
        })
        .catch((err) => {
          setLoader(false);
          showMessage({
            message: "An error accoured while payment!",
            type: "danger",
          });
          console.log("error in CreatePaymentMethord", err);
        });
    }
  };

  //params of lesson or package
  const getPaypalParams = () => {
    if (cardDetail.check === "lessonPurchase") {
      return `?student_id=${props.authData.user_id}&instructor_id=${
        cardDetail.instructorId
      }&time_slot=${cardDetail.timeSlot}&booked_date=${getFormattedDate(
        cardDetail.timeDate
      )}&timezone=${cardDetail.timeZone}&price=${
        cardDetail.price
      }&checkout_type=appointment&query=true`;
    } else {
      return `?student_id=${props.authData.user_id}&instructor_id=${
        cardDetail.packageSelected.user_id
      }&instructor_package_id=${cardDetail.packageSelected.id}&total_hours=${
        cardDetail.packageSelected.total_hours
      }&amount=${
        parseInt(cardDetail.packageSelected.pp_hour) *
        parseInt(cardDetail.packageSelected.total_hours)
      }&checkout_type=packages&query=true`;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.primaryColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
            {cardDetail ? (
              <StripePurchase
                dataList={cardDetail}
                navProps={props}
                tutorData={tutorDetail}
                isfree={false}
              />
            ) : (
              <></>
            )}
            {loader ? (
              <ActivityIndicator size="small" color="#059F82" />
            ) : (
              <>
                <TouchableOpacity
                  style={
                    !activeRadio ? styles.radioCard : styles.activeRadioCard
                  }
                  onPress={() => setActiveRadio(true)}
                >
                  <View
                    style={activeRadio ? styles.activeRadio : styles.radioBtn}
                  ></View>
                  <Image
                    style={styles.iconsImage}
                    source={require("../../../../assets/images/mergeImage.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    activeRadio ? styles.radioCard : styles.activeRadioCard
                  }
                  onPress={() => setActiveRadio(false)}
                >
                  <View
                    style={activeRadio ? styles.radioBtn : styles.activeRadio}
                  ></View>
                  <Image
                    style={styles.iconPapal}
                    source={require("../../../../assets/images/papalMerge.png")}
                  />
                </TouchableOpacity>
                {activeRadio == true ? (
                  <>
                    <CardField
                      postalCodeEnabled={false}
                      placeholder={{
                        number: "4242 4242 4242 42",
                      }}
                      cardStyle={{
                        textColor: "#000000",
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "black",
                        placeholderColor:
                          Platform.OS === "ios" ? null : "lightgrey",
                      }}
                      style={{
                        height: 40,
                        marginHorizontal: "5%",
                        marginVertical: 20,
                      }}
                      onCardChange={(cardDetails) => {
                        setCard(cardDetails);
                      }}
                      onFocus={(focusedField) => {
                        console.log("focusField", focusedField);
                      }}
                    />
                    {cardDetail.check === "lessonPurchase" ? (
                      <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={cardSubmitTrialLesson}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: "bold",
                          }}
                        >
                          SUBMIT
                        </Text>
                      </TouchableOpacity>
                    ) : cardDetail.check === "packagePurchase" ? (
                      <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={cardSubmitPackage}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: "bold",
                          }}
                        >
                          SUBMIT
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </>
                ) : cardDetail.check === "lessonPurchase" ? (
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => onChangeModal(null)}
                  >
                    {props.currencyData.currency.check ? (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        Pay £ {cardDetail.price}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        Pay ${" "}
                        {(
                          cardDetail.price *
                          props.currencyData.currency.currencyRate
                        ).toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : cardDetail.check === "packagePurchase" ? (
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => onChangeModal(null)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Pay $
                      {parseInt(cardDetail.packageSelected.pp_hour) *
                        parseInt(cardDetail.packageSelected.total_hours)}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}

            <PaypalModal
              newPackageModal={modalOpen}
              Queryparams={getPaypalParams()}
              onChangeModal={onChangeModal}
              authData={props.authData}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activeRadio: {
    backgroundColor: "#00B074",
    padding: "2%",
    height: 20,
    width: 20,
    borderRadius: 50 / 2,
    borderColor: "gray",
    borderWidth: 1,
  },
  radioBtn: {
    backgroundColor: "white",
    padding: "2%",
    height: 20,
    width: 20,
    borderRadius: 50 / 2,
    borderColor: "gray",
    borderWidth: 1,
  },
  radioCard: {
    margin: "5%",
    marginTop: 0,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
  },
  activeRadioCard: {
    margin: "5%",
    marginTop: 0,
    paddingHorizontal: "2%",
    paddingVertical: "3%",
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
  },
  iconsImage: {
    height: 20,
    width: 150,
  },
  iconPapal: {
    height: 20,
    width: 150,
    marginLeft: -20,
  },
  headingText: {
    color: "#7F8386",
    marginBottom: "2%",
  },
  headingTextBold: {
    color: "black",
  },
  totalText: {
    color: "black",
    fontSize: 20,
  },
  totalTextDynamic: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  headingTextBoldDynamic: {
    color: "black",
    fontWeight: "bold",
  },
  headingSubText: {
    fontSize: 18,
  },
  bottomLine: {
    borderColor: "#ECECEC",
    borderWidth: 1,
    marginTop: "5%",
    marginBottom: "5%",
  },
  flexSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardDesign: {
    margin: "3%",
    marginTop: "5%",
    backgroundColor: "white",
    elevation: 5,
    padding: "2%",
    borderRadius: 5,
  },
  submitBtn: {
    backgroundColor: "#059F82",
    paddingVertical: "3%",
    paddingHorizontal: "23%",
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    authToken: state.authData.token,
    authData: state.authData.userData,
    currencyData: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthToken: (user) => {
      dispatch(setAuthToken(user));
    },
    onSetAuthUser: (user) => {
      dispatch(setAuthUser(user));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
