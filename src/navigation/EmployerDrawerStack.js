import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import colors from "../Constants/colors";
import Constants from "../Constants/Constants.json";
import EmployerDashboard from "../screens/Employer/EmployerDashboard";
import EmployerProfile from "../screens/Employer/EmployerProfile";
import EmployerDrawerContent from "../screens/Employer/EmployerDrawerContent";
import JobPosted from "../screens/Employer/JobPosted";
import JobPostedList from "../screens/Employer/JobPostedList";
import AppliedJobsList from "../screens/Employer/AppliedJobsList";
import Applicants from "../screens/Employer/Applicants";
import UpdateJob from "../screens/Employer/UpdateJob";
import Draft from "../screens/Employer/Draft";
import ViewJob from "../screens/Employer/ViewJob";
import Resume from "../screens/Employer/Resume";
import ChangePassword from "../screens/ChangePassword";
import Payment_Screen from "../screens/PaymentScreen";
import Payment_Card from "../screens/Payment_Card";
import BoostJobScreen from "../screens/BoostJobScreen";
const Drawer = createDrawerNavigator();

const EmployerDrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerStyle={{
        borderBottomRightRadius: 40,
        width: 320,
        backgroundColor: colors.white,
      }}
      drawerContent={(props) => <EmployerDrawerContent {...props} />}
      initialRouteName={Constants.screen.EmployerDashboard}
    >
      <Drawer.Screen
        name={Constants.screen.EmployerDashboard}
        component={EmployerDashboard}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.EmployerProfile}
        component={EmployerProfile}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name={Constants.screen.JobPosted}
        component={JobPosted}
      />
      <Drawer.Screen
        name={Constants.screen.JobPostedList}
        component={JobPostedList}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.AppliedJobsList}
        component={AppliedJobsList}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.Applicants}
        component={Applicants}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name={Constants.screen.Resume}
        component={Resume}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name={Constants.screen.UpdateJob}
        component={UpdateJob}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name={Constants.screen.Draft}
        component={Draft}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name={Constants.screen.ViewJob}
        component={ViewJob}
      />
      <Drawer.Screen
        name={Constants.screen.Payment_Screen}
        component={Payment_Screen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.ChangePassword}
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.Payment_Card}
        component={Payment_Card}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name={Constants.screen.BoostJob}
        component={BoostJobScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default EmployerDrawerStack;
