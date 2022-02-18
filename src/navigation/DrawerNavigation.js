import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet } from "react-native";
import colors from "../Constants/colors";
import Constants from "../Constants/Constants.json";
import DrawerContent from "../screens/Employee/DrawerContent";
import JobCategoryList from "../screens/Employee/JobCategoryList";
import JobListing from "../screens/Employee/JobListing";
import BottomTabNavigation from "./BottomTabNavigation";
import IndividualJob from "../screens/Employee/IndividualJob";
import JobCategory from "../screens/Employee/JobCategory";
import SavedJobs from "../screens/Employee/SavedJobs";
import ChangePassword from "../screens/ChangePassword";
import AllJobsScreen from "../screens/Employee/AllJobsScreen";
import Payment_Screen from "../screens/PaymentScreen";
import Payment_Card from "../screens/Payment_Card";
import { createStackNavigator } from "@react-navigation/stack";

const { Screen, Navigator } = createStackNavigator();

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerStyle={styles.drawerStyle}
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName={Constants.screen.BottomTabNavigation}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name={Constants.screen.BottomTabNavigation}
        component={BottomTabNavigation}
      />
      <Drawer.Screen
        name={Constants.screen.IndividualJob}
        component={IndividualJob}
      />
      <Drawer.Screen
        name={Constants.screen.JobListing}
        component={JobListing}
      />
      <Drawer.Screen
        name={Constants.screen.JobCategoryList}
        component={JobCategoryList}
      />
      <Drawer.Screen
        name={Constants.screen.JobCategory}
        component={JobCategory}
      />
      <Drawer.Screen
        name={Constants.screen.ChangePassword}
        component={ChangePassword}
      />
      <Drawer.Screen
        name={Constants.screen.AllJobsScreen}
        component={AllJobsScreen}
      />
      <Drawer.Screen
        name={Constants.screen.Payment_Screen}
        component={Payment_Screen}
      />
      <Drawer.Screen
        name={Constants.screen.Payment_Card}
        component={Payment_Card}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderBottomRightRadius: 40,
    width: 320,
    backgroundColor: colors.white,
  },
});

export default DrawerNavigation;
