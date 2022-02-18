import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import colors from "../../Constants/colors";
import MenuIcon from "../../Components/atoms/MenuIcon";
import ScreenTitle from "../../Components/atoms/ScreenTitle";
import LanguagePicker from "../../Components/organisms/LanguagePicker";
import SearchField from "../../Components/molecules/SearchField";
import { jobsListing, getViewJob, getJobList } from "../../redux/slices";
import { useSelector, useDispatch } from "react-redux";
import commonStyles from "../../commonStyles/commonStyles";
import Loader from "../../Components/atoms/Loader";
import { apiCall } from "../../service/ApiCall";
import ApiConstants from "../../service/ApiConstants.json";
import Constants from "../../Constants/Constants.json";
import CompanyLabelCard from "../../Components/atoms/CompanyLabelCard";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const AllJobsScreen = ({ navigation }) => {
  const [dropDown, setDropDown] = useState(false);
  const [lang, setLang] = useState("eng");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const jobsData = useSelector(jobsListing);
  const jobs = jobsData?.data;
  const pagination = jobsData?.pagination;

  const viewJob = async (jobId) => {
    setLoader(true);

    let queryParams = {
      id: jobId,
    };

    try {
      var apiResult = await apiCall(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.ViewJob,
        {},
        queryParams
      );

      if (apiResult.isAxiosError == true) {
        console.log(
          "View Job Method:",
          apiResult.response.data.error.messages.map((val) => val + "\n")
        );
        setLoader(false);
      } else {
        dispatch(getViewJob(apiResult.data.response.data[0]));
        console.log("job", apiResult.data.response.data[0]);
        navigation.navigate(Constants.screen.IndividualJob);
        setLoader(false);
      }
    } catch (error) {
      console.log("Catch Body:", error);
      setLoader(false);
    }
  };

  async function jobsList(page) {
    setLoader(true);

    let queryParams = {
      page: page,
    };

    if (jobsData != undefined) {
      setLoader(false);
    }

    try {
      var apiResponse = await apiCall(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.JobsList,
        {},
        queryParams
      );

      if (apiResponse.isAxiosError == true) {
        console.log("Job Data List Axios Error");
        setLoader(false);
      } else {
        dispatch(getJobList(apiResponse.data.response));
        setLoader(false);
      }
    } catch (error) {
      console.log("Catch Body:", error);
      setLoader(false);
    }
  }

  async function jobsPagination(page, loaderValue) {
    setLoader(loaderValue);

    let queryParams = {
      page: page,
    };

    try {
      var apiResponse = await apiCall(
        ApiConstants.methods.GET,
        ApiConstants.endPoints.JobsList,
        {},
        queryParams
      );

      if (apiResponse.isAxiosError == true) {
        console.log("Pagination Job Data Axios Error");
        setLoader(!loaderValue);
      } else {
        dispatch(getJobList(apiResponse.data.response));
        setLoader(!loaderValue);
      }
    } catch (error) {
      console.log("Catch Body:", error);
      setLoader(!loaderValue);
    }
  }

  useFocusEffect(
    useCallback(() => {
      jobsList(1);
    }, [])
  );

  if (loader == true) {
    return <Loader />;
  }

  const jobItemComponent = ({ item }) => {
    return (
      <View style={commonStyles.jobCardContainer}>
        <View style={commonStyles.jobImageContainer}>
          {item.image_urls ? (
            <Image
              source={{ uri: item.image_urls["3x"] }}
              style={{ ...StyleSheet.absoluteFillObject }}
            />
          ) : (
            <Image
              resizeMode="contain"
              source={require("../../../assets/logoGreen.png")}
              style={commonStyles.jobCardImage}
            />
          )}
        </View>

        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.jobTitle}>{item.title}</Text>

          <Text ellipsizeMode="tail" numberOfLines={3} style={{ fontSize: 12 }}>
            {item.description}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.viewApplicantsButton}
            onPress={() => {
              viewJob(item.id);
            }}
          >
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.white,
              }}
            >
              <Image
                source={require("../../../assets/applicants.png")}
                resizeMode="contain"
                style={styles.applicantImageIcon}
              />
            </View>

            <Text
              style={{
                marginLeft: 3,
                color: colors.white,
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              View Job Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const paginationComponent = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          jobsPagination(item, true);
        }}
        style={{
          ...styles.pagination,
          backgroundColor:
            pagination.current == item ? colors.primaryColor : colors.white,
        }}
      >
        <Text
          style={{
            color: pagination.current == item ? colors.white : colors.black,
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
        <StatusBar backgroundColor={colors.primaryColor} />

        <ImageBackground
          source={require("../../../assets/grayBg.jpg")}
          style={{ flex: 1 }}
        >
          <ImageBackground
            source={require("../../../assets/bgUpG.jpg")}
            style={styles.headerBg}
            imageStyle={styles.headerBgImage}
          >
            <View style={styles.topHeaderContainer}>
              <MenuIcon onPress={() => navigation.openDrawer()} />

              <ScreenTitle title="Jobs" />

              <LanguagePicker
                viewStyle={{ width: 80 }}
                containerStyle={{ flex: 1 }}
                value={lang}
                setValue={setLang}
                open={dropDown}
                setOpen={setDropDown}
              />
            </View>

            {/* <SearchField 
            style={{marginTop: 40}}
          /> */}
          </ImageBackground>

          {jobs != undefined && (
            <View style={commonStyles.jobListingFlatListContainer}>
              <View style={commonStyles.jobCardContainer}>
                <View style={commonStyles.jobImageContainer}>
                  {
                    <Image
                      resizeMode="contain"
                      source={require("../../../assets/logoGreen.png")}
                      style={commonStyles.jobCardImage}
                    />
                  }
                </View>

                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.jobTitle}>Title</Text>

                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={3}
                    style={{ fontSize: 12 }}
                  >
                    Permium|Sponsored
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.viewApplicantsButton}
                    // onPress={() => {
                    //   viewJob(item.id)
                    // }}
                  >
                    <View
                      style={{
                        height: 30,
                        // width: "20%",
                        borderRadius: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.white,
                      }}
                    >
                      <Image
                        source={require("../../../assets/applicants.png")}
                        resizeMode="contain"
                        style={styles.applicantImageIcon}
                      />
                    </View>

                    <Text
                      style={{
                        marginLeft: 3,
                        color: colors.white,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      View Job Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={jobs}
                keyExtractor={(key, index) => index.toString()}
                renderItem={jobItemComponent}
              />
            </View>
          )}

          {pagination != undefined && (
            <View style={{ alignItems: "center", marginVertical: 5 }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={pagination.pages}
                keyExtractor={(key, index) => index.toString()}
                renderItem={paginationComponent}
                horizontal
              />
            </View>
          )}
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.pureWhite,
  },
  headerBg: {
    height: Dimensions.get("window").height * 0.15,
    padding: 9,
  },
  headerBgImage: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  topHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobTitle: {
    color: colors.primaryColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  applicantImageIcon: {
    height: 20,
    width: 20,
  },
  viewApplicantsButton: {
    marginTop: "auto",
    padding: 2,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonColor,
    width: "60%",
  },
  pagination: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    // borderColor: colors.primaryColorLight
  },
});

export default AllJobsScreen;
