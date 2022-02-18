import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import React, { useState, useEffect } from "react";
import colors from "../Constants/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { apiCall } from "../service/ApiCall";
import ApiConstants from "../service/ApiConstants.json";
import { iteratorSymbol } from "immer/dist/internal";
import CompanyLabelCard from "../Components/atoms/CompanyLabelCard";
import Logo from "../Components/atoms/Logo";
import { log } from "react-native-reanimated";
import Constant from "../Constants/Constants.json";
const Payment_Screen = (props) => {
  const [package_Sub, setPackage_Sub] = useState([]);
  const Subscribe = async () => {
    try {
      const api = await apiCall(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.subscribe,
        undefined
      );
      setPackage_Sub(api.data.response.data);
      console.log("api", api.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    Subscribe();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryColor }}>
      <SafeAreaView style={{ backgroundColor: colors.primaryColor }} />
      <Logo />
      <FlatList
        data={package_Sub}
        keyExtractor={(item, index) => (item = index)}
        renderItem={({ item }) => {
          return (
            <View style={{ flex: 1 }}>
              <View styley={{}}>
                <View style={styles.main_div}>
                  <View style={styles.text1}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.price}$
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderBottomColor: "black",
                      width: 120,
                      marginHorizontal: 35,
                    }}
                  ></View>

                  <View style={{ marginTop: 15, alignSelf: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 5,
                        height: 25,
                      }}
                    >
                      <AntDesign
                        name="checkcircle"
                        size={20}
                        color={colors.primaryColorLight}
                      />
                      <Text style={{ marginHorizontal: 5 }}>{item.name}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 5,
                        height: 25,
                      }}
                    >
                      <AntDesign
                        name="checkcircle"
                        size={20}
                        color={colors.primaryColorLight}
                      />
                      <Text style={{ marginHorizontal: 5 }}>
                        days {item.days}
                      </Text>
                    </View>
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <TouchableOpacity
                      style={styles.Subs}
                      color={colors.buttonColor}
                      onPress={() =>
                        props.navigation.navigate(
                          Constant.screen.Payment_Card,
                          { package_id: 1 }
                        )
                      }
                    >
                      <Text
                        style={{ textAlign: "center", color: colors.pureWhite }}
                        color={colors.primaryColor}
                      >
                        Subscribe
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
      <CompanyLabelCard />
    </View>
  );
};
const styles = StyleSheet.create({
  main_div: {
    width: 190,
    height: 190,
    borderWidth: 1,
    marginTop: 40,
    marginLeft: 100,
    marginBottom: 40,
    borderColor: "black",
    backgroundColor: colors.pureWhite,
    borderRadius: 15,
  },
  Subs: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 50,
    backgroundColor: colors.primaryColor,
    width: 90,
    height: 30,
    padding: 3,
  },
  text1: {
    margin: 15,
    alignSelf: "center",
  },
});

export default Payment_Screen;
