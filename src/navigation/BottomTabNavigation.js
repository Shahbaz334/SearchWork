import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../Constants/colors";
import Constants from "../Constants/Constants.json";
import EmployeeDashboard from "../screens/Employee/EmployeeDashboard";
import EmployeeProfile from "../screens/Employee/EmployeeProfile";
import SavedJobs from "../screens/Employee/SavedJobs";
import IconContainer from "../Components/molecules/IconContainer";
import EmployeeResume from "../screens/Employee/EmployeeResume";
import { setLanguageSelected } from "../redux/slices";
import { strings } from "../Language/i18n";
import LocalStrings from "../Language/Strings";

const BottomTabNavigation = () => {
  let selectedLang = useSelector(setLanguageSelected);

  const { Screen, Navigator } = createBottomTabNavigator();

  return (
    <Navigator
      screenProps={{ selectedLang }}
      initialRouteName={Constants.screen.EmployeeDashboard}
      tabBarOptions={{
        showLabel: false,
        style: styles.navigatorContainer,
        keyboardHidesTabBar: true,
      }}
    >
      <Screen
        name={Constants.screen.EmployeeDashboard}
        component={EmployeeDashboard}
        options={{
          tabBarLabel: "Home",

          tabBarIcon: ({ focused }) => (
            <IconContainer
              title={LocalStrings.Home}
              ContainerStyle={{
                backgroundColor: focused ? colors.white : null,
              }}
              style={{
                color: focused ? colors.primaryColor : colors.white,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              <Entypo
                name="home"
                color={focused ? colors.primaryColor : colors.white}
                size={26}
              />
            </IconContainer>
          ),
        }}
      />

      <Screen
        name={Constants.screen.SavedJobs}
        component={SavedJobs}
        options={{
          tabBarLabel: "SavedJobs",
          tabBarIcon: ({ focused }) => (
            <IconContainer
              title={LocalStrings.Saved}
              ContainerStyle={{
                backgroundColor: focused ? colors.white : null,
              }}
              style={{
                color: focused ? colors.primaryColor : colors.white,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              <FontAwesome
                name="bookmark"
                color={focused ? colors.primaryColor : colors.white}
                size={26}
              />
            </IconContainer>
          ),
        }}
      />

      <Screen
        name={Constants.screen.EmployeeProfile}
        component={EmployeeProfile}
        options={{
          tabBarLabel: "EmployeeProfile",
          tabBarIcon: ({ focused }) => (
            <IconContainer
              title={LocalStrings.Profile}
              ContainerStyle={{
                backgroundColor: focused ? colors.white : null,
              }}
              style={{
                color: focused ? colors.primaryColor : colors.white,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              <FontAwesome
                name="user"
                color={focused ? colors.primaryColor : colors.white}
                size={26}
              />
            </IconContainer>
          ),
        }}
      />

      <Screen
        name={Constants.screen.EmployeeResume}
        component={EmployeeResume}
        options={{
          tabBarLabel: "Resume",
          tabBarIcon: ({ focused }) => (
            <IconContainer
              title={LocalStrings.MyRESUME}
              ContainerStyle={{
                backgroundColor: focused ? colors.white : null,
              }}
              style={{
                color: focused ? colors.primaryColor : colors.white,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              <FontAwesome
                name="id-card"
                color={focused ? colors.primaryColor : colors.white}
                size={26}
              />
            </IconContainer>
          ),
        }}
      />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  navigatorContainer: {
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
  },
});

export default BottomTabNavigation;
