import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import HeaderImage from "../../Components/atoms/HeaderImage";
import Geolocation from "@react-native-community/geolocation";
import MenuIcon from "../../Components/atoms/MenuIcon";
import Button from "../../Components/molecules/Button";
import HeaderRowContainer from "../../Components/molecules/HeaderRowContainer";
import InputField from "../../Components/molecules/InputField";
import LanguagePicker from "../../Components/organisms/LanguagePicker";
import colors from "../../Constants/colors";
import { cityStates } from "../../Components/organisms/CityStates";
import StatePicker from "../../Components/organisms/StatePicker";
import { useSelector, useDispatch } from "react-redux";
import {
  jobPostedSelector,
  jobsCategoryList,
  userLogin,
  setJobPost,
  setLanguageSelected,
} from "../../redux/slices";
//import { setJobPost } from '../../redux/slices';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
//import translate from 'translate-google-api';
import ScreenTitle from "../../Components/atoms/ScreenTitle";
import CustomPicker from "../../Components/organisms/CustomPicker";
import Constants from "../../Constants/Constants.json";
import CustomModal from "../../Components/organisms/CustomModal";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../../Components/atoms/Loader";
import { apiCall } from "../../service/ApiCall";
import ApiConstants from "../../service/ApiConstants.json";
import { useRoute } from "@react-navigation/native";
import ErrorModal from "../../Components/organisms/ErrorModal";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { strings } from "../../Language/i18n";
import LocalStrings from "../../Language/Strings";
import AsyncStorage from "@react-native-community/async-storage";

//import translate from 'google-translate-api';
//import {GoogleTranslator} from '@translate-tools/core/translators/GoogleTranslator';

const initialPositionRegion = {
  latitude: 31.1537736,
  longitude: 74.2075474,
  latitudeDelta: 0.03358723958820065,
  longitudeDelta: 0.04250270688370961,
};
const GOOGLE_MAPS_APIKEY = "AIzaSyAG8XBFKHqkH3iKweO_y3iC6kYvcwdsKxY";

const JobPosted = ({ navigation }) => {
  let selectedLang = useSelector(setLanguageSelected);

  const MapRef = useRef(null);
  const route = useRoute();

  const [latitude, setLatitude] = useState(31.1537736);
  const [longitude, setLongitude] = useState(74.2075474);

  const [myDirection, setMyDirection] = useState(initialPositionRegion);

  const [lang, setLang] = useState("eng");
  const [dropDown, setDropDown] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [jobCategory, setJobCategory] = useState(0);
  const [jobSubCategory, setJobSubCategory] = useState(0);
  const [reqLang, setReqLang] = useState(0);
  const [reqExp, setReqExp] = useState(0);
  const [jobDescription, setJobDescription] = useState("");
  const [jobPostNos, setJobPostNos] = useState("");
  const [statePicker, setStatePicker] = useState(0);
  const [city, setCity] = useState(0);
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const [missingFieldModal, setMissinFieldModal] = useState(false);
  const [missingField, setMissingField] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [accountStatusModal, setAccountStatusModal] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const [pause, setPause] = useState("");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      accountStatus();
    }
  }, [isFocused]);

  async function accountStatus() {
    let status = await AsyncStorage.getItem("PauseBit");
    console.log("Account Status....", status);
    setPause(status);
    if (status == "0") {
      setAccountStatusModal(true);
    }
  }
  const jobLanguages = [
    { key: 0, value: "English Only" },
    { key: 1, value: "Spanish Only" },
    { key: 2, value: "Bilingual" },
    // { key: 3, value: 'Other' },
  ];

  const jobExperience = [
    { key: 0, value: "Less than a year" },
    { key: 1, value: "1 Year" },
    { key: 2, value: "2 Years or more" },
    // { key: 3, value: 'More than 2 years' },
  ];

  const getEstimatedTimeOfArrival = async (lat, lng) => {
    // console.log('====================',lat + ' ' +lng)
    let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    let params = `origins=${lat},${lng}&destinations=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`;
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;

    try {
      let response = await fetch(finalApiURL);
      let responseJson = await response.json();
      // console.log("responseJson To Get Time and Distance: ", responseJson.origin_addresses[0]);
      setAddress(responseJson.origin_addresses[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const changeValue = (_markerData) => {
    // console.log('on reigon change', _markerData)
    const newMarkerData = {
      ...myDirection,
      ..._markerData,
    };
    setMyDirection(newMarkerData);
    getEstimatedTimeOfArrival(newMarkerData.latitude, newMarkerData.longitude);
  };

  const getCurrentLatLng = () => {
    // console.log('Getting current Location ... ')
    Geolocation.getCurrentPosition(
      (position) => {
        // setMyDirection(position.coords)

        changeValue(position.coords);
        // setLatitude(Number(position.coords.latitude))
        // setLongitude(Number(position.coords.longitude))
        // console.log('Lat Long========', position.coords)
      },
      (error) => {
        console.log("error ", error);
      }
      // {
      //   enableHighAccuracy: false,
      //   timeout: 30000,
      //   maximumAge: 1000
      // },
    );
  };

  const dispatch = useDispatch();

  var job = useSelector(jobPostedSelector);
  var jobObj = { ...job };
  // console.log(jobCategory)
  const categoryList = useSelector(jobsCategoryList);
  const subCategoryItems = categoryList.filter(
    (val) => val.category_id_decode == jobCategory
  )[0]?.subcategories;

  const cities = cityStates.filter((value) => value.state == job.state);
  const cityItems = cities.length > 0 ? cities[0].cities : null;

  var bodyFormData = new FormData();

  bodyFormData.append("title", jobTitle);
  bodyFormData.append("category_id", jobCategory);
  jobSubCategory != 0 && bodyFormData.append("sub_category_id", jobSubCategory);
  bodyFormData.append("hourly_pay", hourlyPay);
  bodyFormData.append("duration", jobDuration);
  bodyFormData.append("description", jobDescription);
  bodyFormData.append("st_address", address);
  bodyFormData.append("city", city);
  bodyFormData.append("state", statePicker);
  imageUrl != "" &&
    bodyFormData.append("image", {
      uri: imageUrl,
      name: "test_image",
      type: "image/*",
    });
  bodyFormData.append("zipcode", zipCode);
  jobPostNos != 0 && bodyFormData.append("no_of_posts", jobPostNos);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (
        (job.jobTitle != "" ||
          job.address != "" ||
          job.city != 0 ||
          job.duration != 0 ||
          job.hourlyPay != "" ||
          job.jobCategory != 0 ||
          job.jobDescription != "" ||
          job.jobSubCategory != 0 ||
          job.zipCode != "" ||
          job.requiredLanguage != 0 ||
          job.requiredExperience != 0) &&
        route.name == "JobPosted"
      ) {
        setisModal(true);
      } else {
        setisModal(false);
      }
    });
  }, [navigation, job]);

  useFocusEffect(
    useCallback(() => {
      setJobTitle("");
      setHourlyPay("");
      setJobDuration(0);
      setJobCategory(0);
      setJobSubCategory(0);
      setReqLang(0);
      setReqExp(0);
      setImageUrl("");
      setJobDescription("");
      setJobPostNos(0);
      setAddress("");
      setStatePicker(0);
      setCity(0);
      setZipCode("");
      getCurrentLatLng();
    }, [])
  );

  const onCancel = () => {
    (jobObj.jobTitle = ""),
      (jobObj.hourlyPay = ""),
      (jobObj.duration = 0),
      (jobObj.jobCategory = 0),
      (jobObj.jobSubCategory = 0),
      (jobObj.requiredLanguage = 0),
      (jobObj.requiredExperience = 0),
      (jobObj.jobDescription = ""),
      (jobObj.noOfEmployees = 0),
      (jobObj.state = 0),
      (jobObj.city = 0),
      (jobObj.zipCode = ""),
      (jobObj.address = ""),
      dispatch(setJobPost(jobObj));
  };

  async function jobPosted() {
    try {
      setLoader(true);

      var apiResponse = await apiCall(
        ApiConstants.methods.POST,
        ApiConstants.endPoints.PostJob,
        bodyFormData
      );

      if (apiResponse.isAxiosError == true) {
        setErrorMessage(
          apiResponse.response.data.error.messages.map((val) => val + "\n")
        );
        setErrorModal(true);
        setLoader(false);
      } else {
        setLoader(false);
        setErrorModal(false);
        setSuccessModal(true);
      }
    } catch (error) {
      console.log("Job Posted Catch Body:", error);
      setLoader(false);
    }
  }

  if (loader == true) {
    return <Loader />;
  }

  return (
    <ScrollView
      screenProps={{ selectedLang }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView />
      <ErrorModal
        isVisible={errorModal}
        message={errorMessage}
        onPress={() => setErrorModal(false)}
      />

      <ErrorModal
        isVisible={accountStatusModal}
        message={"Your account is paused. Un-pause it to continue..."}
        onPress={() => {
          setAccountStatusModal(false),
            setTimeout(() => {
              navigation.goBack();
            }, 500);
        }}
      />

      <CustomModal
        type="confirmation"
        isVisible={missingFieldModal}
        message={"Please fill all the mandatory fields."}
        imageSource={require("../../../assets/warning.png")}
        onPressOk={() => {
          setMissinFieldModal(false);
          setMissingField(true);
        }}
        buttonText="Ok"
      />

      <CustomModal
        type="confirmation"
        isVisible={successModal}
        message={"Job has been successfully created."}
        imageSource={require("../../../assets/checked.png")}
        onPressOk={() => {
          setMissinFieldModal(false);
          setMissingField(false);
          setSuccessModal(false);
          setJobTitle("");
          setHourlyPay("");
          setImageUrl("");
          setJobDuration(0);
          setJobCategory(0);
          setJobSubCategory(0);
          setReqLang(0);
          setReqExp(0);
          setJobDescription("");
          setJobPostNos(0);
          setAddress("");
          setStatePicker(0);
          setCity(0);
          setZipCode("");
          (jobObj.jobTitle = ""),
            (jobObj.hourlyPay = ""),
            (jobObj.duration = 0),
            (jobObj.jobCategory = 0),
            (jobObj.jobSubCategory = 0),
            (jobObj.requiredLanguage = 0),
            (jobObj.requiredExperience = 0),
            (jobObj.jobDescription = ""),
            (jobObj.noOfEmployees = 0),
            (jobObj.state = 0),
            (jobObj.city = 0),
            (jobObj.zipCode = ""),
            (jobObj.address = ""),
            dispatch(setJobPost(jobObj));
          navigation.navigate(Constants.screen.JobPostedList);
        }}
        buttonText="Ok"
      />

      <StatusBar backgroundColor={colors.primaryColor} />

      <ImageBackground
        source={require("../../../assets/grayBg.jpg")}
        style={styles.bg}
      >
        <HeaderImage
          style={{ height: Dimensions.get("window").height * 0.15 }}
        />
        <HeaderRowContainer>
          <MenuIcon onPress={() => navigation.openDrawer()} />
          <ScreenTitle title="Post A Job" />
          <LanguagePicker />
        </HeaderRowContainer>

        <View style={styles.infoContainer}>
          <InputField
            textStyle={{
              color:
                jobTitle == "" && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            title={LocalStrings.JobTitle}
            iconName="person"
            placeholder="Job Title"
            maxLength={30}
            value={jobTitle}
            onChangeText={(val) => {
              setJobTitle(val);
              jobObj.jobTitle = val;
              dispatch(setJobPost(jobObj));
            }}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <InputField
              textStyle={{
                color:
                  hourlyPay == "" && missingField == true
                    ? "red"
                    : colors.primaryColor,
              }}
              style={{ flex: 0.45 }}
              keyboardType={"number-pad"}
              maxLength={5}
              title={LocalStrings.HourlyPay}
              iconName="person"
              placeholder="0$"
              value={hourlyPay}
              onChangeText={(val) => {
                setHourlyPay(val);
                jobObj.hourlyPay = val;
                dispatch(setJobPost(jobObj));
              }}
            />

            <CustomPicker
              pickerTitleStyle={{
                color:
                  jobDuration == "" && missingField == true
                    ? "red"
                    : colors.primaryColor,
              }}
              pickerContainerStyle={{ marginTop: 10, flex: 0.52 }}
              label=""
              pickerTitle={LocalStrings.JobType}
              selectedValue={jobDuration}
              onValueChange={(itemValue, itemIndex) => {
                setJobDuration(itemValue);
                jobObj.duration = itemValue;
                dispatch(setJobPost(jobObj));
              }}
            >
              <Picker.Item
                label="Part Time"
                value={"part_time"}
                style={{ fontSize: 14 }}
              />
              <Picker.Item
                label="Full Time"
                value={"full_time"}
                style={{ fontSize: 14 }}
              />
            </CustomPicker>
          </View>

          {/* <CustomPicker
            pickerTitleStyle={{ color: jobCategory == 0 && missingField == true ? 'red' : colors.primaryColor }}
            pickerContainerStyle={{ marginTop: 10 }}
            label='Select Job Category'
            pickerTitle={LocalStrings.JobCategory}
            selectedValue={jobCategory}
            onValueChange={(itemValue, itemIndex) => {
              console.log("itemCategory",itemValue)
              setJobCategory(itemValue)
              jobObj.jobCategory = itemValue
              dispatch(setJobPost(jobObj))
            }}
          > */}
          <CustomPicker
            pickerTitleStyle={{
              color:
                jobCategory == 0 && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            pickerContainerStyle={{ marginTop: 10 }}
            label="Select Job Category"
            pickerTitle="Job Category"
            selectedValue={jobCategory}
            onValueChange={(itemValue, itemIndex) => {
              setJobCategory(itemValue);
              jobObj.jobCategory = itemValue;
              dispatch(setJobPost(jobObj));
              console.log("jjjj", itemValue);
            }}
          >
            {/* {
              // category_id_decode
              categoryList.map((val, index) => (
                <Picker.Item style={{ fontSize: 14 }} key={index} label={val.name} value={val.name} />
              ))
            } */}
            {categoryList.map((val, index) => (
              <Picker.Item
                style={{ fontSize: 14 }}
                key={index}
                label={val.name}
                value={val.category_id_decode}
              />
            ))}
          </CustomPicker>

          {/* {
            jobCategory == 'Other' ?

              <InputField
                inputFieldStyle={address.length > 35 && { height: Dimensions.get('window').height * 0.065 }}
                textStyle={{ color: address == '' && missingField == true ? 'red' : colors.primaryColor }}
                title={LocalStrings.JobSubCategory}
                placeholder='Select Job Sub Category'
                maxLength={100}
                multiline={false}
              />
              : */}
          {jobCategory == 72 ? (
            <InputField
              textStyle={{
                color:
                  subCategoryItems != null &&
                  jobSubCategory == 0 &&
                  missingField == true
                    ? "red"
                    : colors.primaryColor,
              }}
              style={{ flex: 0.45 }}
              // keyboardType={'number-pad'}
              // maxLength={5}
              title="other"
              placeholder="Define Category"
              selectedValue={jobSubCategory}
              onValueChange={(itemValue, itemIndex) => {
                setJobSubCategory(itemValue);
                jobObj.jobSubCategory = itemValue;
                dispatch(setJobPost(jobObj));
              }}
            />
          ) : (
            // <CustomPicker
            //   pickerTitleStyle={{ color: (subCategoryItems != null && jobSubCategory == 0 && missingField == true) ? 'red' : colors.primaryColor }}
            //   pickerContainerStyle={{ marginTop: 10 }}
            //   label='Select Job Sub Category'
            //   pickerTitle={LocalStrings.JobSubCategory}
            //   selectedValue={jobSubCategory}
            //   onValueChange={(itemValue, itemIndex) => {
            //     setJobSubCategory(itemValue)
            //     jobObj.jobSubCategory = itemValue
            //     dispatch(setJobPost(jobObj))
            //   }}
            // >
            <CustomPicker
              pickerTitleStyle={{
                color:
                  subCategoryItems != null &&
                  jobSubCategory == 0 &&
                  missingField == true
                    ? "red"
                    : colors.primaryColor,
              }}
              pickerContainerStyle={{ marginTop: 10 }}
              label="Select Job Sub Category"
              pickerTitle="Job Sub Category"
              selectedValue={jobSubCategory}
              onValueChange={(itemValue, itemIndex) => {
                setJobSubCategory(itemValue);
                jobObj.jobSubCategory = itemValue;
                dispatch(setJobPost(jobObj));
              }}
            >
              {/* {
                  subCategoryItems != null ?
                    subCategoryItems.map((val, index) => (
                      <Picker.Item style={{ fontSize: 14 }} key={index} label={val.name} value={val.id} />
                    ))
                    : null
                }
              </CustomPicker> */}
              {subCategoryItems != null
                ? subCategoryItems.map((val, index) => (
                    <Picker.Item
                      style={{ fontSize: 14 }}
                      key={index}
                      label={val.name}
                      value={val.id}
                    />
                  ))
                : null}
            </CustomPicker>
          )}

          {/* Added here */}

          <CustomPicker
            pickerTitleStyle={{
              color:
                reqLang == 0 && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            pickerContainerStyle={{ marginTop: 10 }}
            label="Select Language"
            pickerTitle={LocalStrings.Language}
            selectedValue={reqLang}
            onValueChange={(itemValue, itemIndex) => {
              setReqLang(itemValue);
              jobObj.requiredLanguage = itemValue;
              dispatch(setJobPost(jobObj));
            }}
          >
            {jobLanguages.map((val, index) => (
              <Picker.Item
                style={{ fontSize: 14 }}
                key={index}
                label={val.value}
                value={val.value}
              />
            ))}
          </CustomPicker>

          <CustomPicker
            pickerTitleStyle={{
              color:
                reqExp == 0 && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            pickerContainerStyle={{ marginTop: 10 }}
            label="Select Experience Level"
            pickerTitle={LocalStrings.Experience}
            selectedValue={reqExp}
            onValueChange={(itemValue, itemIndex) => {
              setReqExp(itemValue);
              jobObj.requiredExperience = itemValue;
              dispatch(setJobPost(jobObj));
            }}
          >
            {/* {
              categoryList.map((val, index) => (
                <Picker.Item style={{ fontSize: 14 }} key={index} label={val.name} value={val.category_id_decode} />
              )) 
            }  */}
            {jobExperience.map((val, index) => (
              <Picker.Item
                style={{ fontSize: 14 }}
                key={index}
                label={val.value}
                value={val.value}
              />
            ))}
          </CustomPicker>

          {/* End Editing */}

          <Text style={styles.uploadImageText}>{LocalStrings.UploadImage}</Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              justifyContent: "space-between",
            }}
          >
            <View
              style={
                imageUrl == ""
                  ? styles.EmptyUploadImageContainer
                  : styles.UploadImageContainer
              }
            >
              <MaterialIcons
                name="cloud-upload"
                size={18}
                color={colors.gray}
              />
              <Text
                style={
                  imageUrl == ""
                    ? styles.emptyUploadImageText
                    : { color: colors.gray, opacity: 0.7 }
                }
              >
                Upload Image
              </Text>
              {imageUrl != "" ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ height: 40, width: 50, borderRadius: 5 }}
                />
              ) : null}
            </View>

            <Button
              style={{
                backgroundColor: colors.primaryColor,
                padding: 5,
                borderRadius: 15,
                height: Dimensions.get("window").height * 0.065,
              }}
              titleStyle={{ marginLeft: 5 }}
              iconName={"cloud-upload"}
              title={LocalStrings.Upload}
              onPress={() => {
                let options;
                launchImageLibrary(
                  (options = {
                    mediaType: "photo",
                    maxHeight: 500,
                    maxWidth: 500,
                    //includeBase64: true
                  }),
                  (response) => {
                    //console.log('Response:',response)

                    if (response.didCancel) {
                      // console.log('User cancelled image picker');
                      setImageUrl("");
                    } else if (response.errorMessage) {
                      console.log("Error:", response.errorMessage);
                    } else {
                      const source = response?.assets[0].uri;
                      //const source = { uri: response.assets[0].uri }
                      setImageUrl(source);
                      //setImageFileName(response.assets[0].fileName)
                    }
                  }
                );
              }}
            />
          </View>

          <InputField
            textStyle={{
              color:
                jobDescription == "" && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            title={LocalStrings.Description}
            placeholder="Job Description"
            maxLength={250}
            multiline={true}
            inputFieldStyle={{
              alignItems: "flex-start",
              height: Dimensions.get("window").height * 0.2,
            }}
            value={jobDescription}
            onChangeText={(val) => {
              setJobDescription(val);
              jobObj.jobDescription = val;
              dispatch(setJobPost(jobObj));
            }}
          />
          <Text
            style={{
              alignSelf: "flex-end",
              color: colors.darkGray,
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            {`${jobDescription.length} / 250 Characters`}
          </Text>

          {/* ---------------------------------Map------------------------------- */}

          <Text style={styles.title}>{LocalStrings.Location}</Text>
          <View style={styles.MapView}>
            <MapView
              ref={MapRef}
              region={myDirection}
              showsUserLocation={true}
              maxZoomLevel={20}
              onRegionChangeComplete={changeValue}
              style={[StyleSheet.absoluteFill, { width: "100%" }]}
            >
              <Marker
                draggable
                onDragEnd={(e) => {
                  let lat = e.nativeEvent.coordinate.latitude;
                  let long = e.nativeEvent.coordinate.longitude;
                  setMyDirection({
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                  // getEstimatedTimeOfArrival(lat, long)
                  // console.log("Latitude: ", lat)
                  // console.log("Longitude: ", long)
                }}
                coordinate={myDirection}
                title={"My Location"}
                description={"Satellite Town Gujranwala"}
              >
                <Ionicons name="location-sharp" size={30} color="red" />
              </Marker>
            </MapView>
          </View>
          <CustomPicker
            pickerContainerStyle={{ marginTop: 10 }}
            label="Select No. Of Employees"
            pickerTitle={LocalStrings.NoOfEmployees}
            selectedValue={jobPostNos}
            onValueChange={(itemValue, itemIndex) => {
              setJobPostNos(itemValue);
              jobObj.noOfEmployees = itemValue;
              dispatch(setJobPost(jobObj));
            }}
          >
            <Picker.Item label={"1"} value={"1"} style={{ fontSize: 14 }} />
            <Picker.Item label={"2"} value={"2"} style={{ fontSize: 14 }} />
            <Picker.Item label={"3"} value={"3"} style={{ fontSize: 14 }} />
            <Picker.Item label={"4"} value={"4"} style={{ fontSize: 14 }} />
            <Picker.Item label={"5"} value={"5"} style={{ fontSize: 14 }} />
            <Picker.Item label={"6"} value={"6"} style={{ fontSize: 14 }} />
            <Picker.Item label={"7"} value={"7"} style={{ fontSize: 14 }} />
            <Picker.Item label={"8"} value={"8"} style={{ fontSize: 14 }} />
            <Picker.Item label={"9"} value={"9"} style={{ fontSize: 14 }} />
            <Picker.Item label={"10"} value={"10"} style={{ fontSize: 14 }} />
            <Picker.Item
              label={"1 - 15"}
              value={"11"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 20"}
              value={"12"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 25"}
              value={"13"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 30"}
              value={"14"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 35"}
              value={"15"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 40"}
              value={"16"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 45"}
              value={"17"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item
              label={"1 - 50"}
              value={"18"}
              style={{ fontSize: 14 }}
            />
            <Picker.Item label={"50+"} value={"18"} style={{ fontSize: 14 }} />
          </CustomPicker>

          <InputField
            inputFieldStyle={
              address?.length > 35 && {
                height: Dimensions.get("window").height * 0.078,
              }
            }
            textStyle={{
              color:
                address == "" && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            title="Address"
            placeholder="Address"
            iconName="location-sharp"
            maxLength={100}
            multiline={address?.length > 35 ? true : false}
            value={address}
            onChangeText={(val) => {
              setAddress(val);
              jobObj.address = val;
              dispatch(setJobPost(jobObj));
            }}
          />

          <StatePicker
            pickerTitleStyle={{
              color:
                statePicker == 0 && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
            items={cityStates}
            selectedValue={statePicker}
            onValueChange={(itemValue, itemIndex) => {
              setStatePicker(itemValue);
              jobObj.state = itemValue;
              dispatch(setJobPost(jobObj));
            }}
          />

          <CustomPicker
            pickerTitleStyle={{
              color:
                city == 0 && missingField == true ? "red" : colors.primaryColor,
            }}
            pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
            label="Select City"
            pickerTitle={LocalStrings.city}
            selectedValue={city}
            onValueChange={(itemValue, itemIndex) => {
              setCity(itemValue);
              jobObj.city = itemValue;
              dispatch(setJobPost(jobObj));
            }}
          >
            {cities.length > 0
              ? cityItems.map((val, index) => (
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    key={index}
                    label={val.city}
                    value={val.city}
                  />
                ))
              : null}
          </CustomPicker>

          <InputField
            textStyle={{
              color:
                zipCode == "" && missingField == true
                  ? "red"
                  : colors.primaryColor,
            }}
            keyboardType={"number-pad"}
            maxLength={5}
            title={LocalStrings.zipCode}
            placeholder="Zip Code"
            value={zipCode}
            onChangeText={(val) => {
              setZipCode(val);
              jobObj.zipCode = val;
              dispatch(setJobPost(jobObj));
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
              marginLeft: 7,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/'${address}, ${city}, ${statePicker}, ${zipCode}`
                ).catch((err) => console.error("An error occurred", err))
              }
            >
              <Text style={{ fontSize: 12, color: colors.buttonColor }}>
                {LocalStrings.ViewfullAddress}
              </Text>
            </TouchableOpacity>

            <MaterialIcons
              name="location-city"
              size={20}
              color={colors.primaryColor}
              style={{ marginLeft: 3 }}
            />
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.primaryColor }}
            title={LocalStrings.Post}
            onPress={() => {
              if (
                jobTitle == "" ||
                hourlyPay == "" ||
                jobDuration == 0 ||
                jobCategory == 0 ||
                jobDescription == "" ||
                address == "" ||
                statePicker == 0 ||
                city == 0 ||
                zipCode == ""
              ) {
                setMissinFieldModal(true);
              } else {
                jobPosted();
              }
            }}
          />

          <Button
            style={styles.button}
            title={LocalStrings.Cancel}
            onPress={() => {
              navigation.navigate(Constants.screen.EmployerDashboard);
              onCancel();
            }}
          />
        </View>
      </ImageBackground>

      {isModal && (
        <CustomModal
          message={"You have an unposted job."}
          isVisible={isModal}
          imageSource={require("../../../assets/diagnostic.png")}
          onPressYes={() => {
            setisModal(false);
            navigation.navigate(Constants.screen.Draft);
          }}
          onPressNo={() => setisModal(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  screenTitle: {
    alignSelf: "center",
    marginTop: 20,
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 9,
    marginHorizontal: 9,
    padding: 10,
  },
  picker: {
    marginTop: 4,
    height: Dimensions.get("window").height * 0.065,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gray,
    justifyContent: "center",
  },
  emptyUploadImageText: {
    color: colors.gray,
    opacity: 0.7,
    marginLeft: 7,
  },
  chooseFileButton: {
    //flexDirection: 'column',
    height: Dimensions.get("window").height * 0.06,
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: colors.primaryColor,
    padding: 5,
    //flex: 0.45
    //width: 130
  },
  picker: {
    marginTop: 4,
    height: Dimensions.get("window").height * 0.065,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gray,
    justifyContent: "center",
  },
  mapView: {
    marginTop: 20,
    overflow: "hidden",
    height: Dimensions.get("window").height * 0.15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "gray",
  },
  bottomButtonContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    borderRadius: 0,
    height: Dimensions.get("window").height * 0.085,
  },
  uploadImageText: {
    marginLeft: 7,
    marginTop: 10,
    fontWeight: "bold",
    color: colors.primaryColor,
  },
  EmptyUploadImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1.5,
    flex: 0.93,
    height: Dimensions.get("window").height * 0.065,
  },
  UploadImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1.5,
    flex: 0.93,
    height: Dimensions.get("window").height * 0.065,
  },
  MapView: {
    borderRadius: 15,
    height: Dimensions.get("window").height * 0.3,
    borderColor: "gray",
    borderWidth: 1.5,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
  },
  title: {
    color: colors.primaryColor,
    fontWeight: "700",
    marginLeft: 7,
  },
});

export default JobPosted;

// import { Picker } from '@react-native-picker/picker';
// import React, { useState, useEffect, useCallback } from 'react';
// import { Dimensions, ImageBackground, ScrollView, TouchableOpacity, Linking, StatusBar, StyleSheet, Text, View, Image } from 'react-native';
// import HeaderImage from '../../Components/atoms/HeaderImage';
// import MenuIcon from '../../Components/atoms/MenuIcon';
// import Button from '../../Components/molecules/Button';
// import HeaderRowContainer from '../../Components/molecules/HeaderRowContainer';
// import InputField from '../../Components/molecules/InputField';
// import LanguagePicker from '../../Components/organisms/LanguagePicker';
// import colors from '../../Constants/colors';
// import { cityStates } from '../../Components/organisms/CityStates';
// import StatePicker from '../../Components/organisms/StatePicker';
// import { useSelector, useDispatch } from 'react-redux';
// import { jobPostedSelector, jobsCategoryList, userLogin, setJobPost } from '../../redux/slices';
// //import { setJobPost } from '../../redux/slices';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// //import translate from 'translate-google-api';
// import ScreenTitle from '../../Components/atoms/ScreenTitle';
// import CustomPicker from '../../Components/organisms/CustomPicker';
// import Constants from '../../Constants/Constants.json';
// import CustomModal from '../../Components/organisms/CustomModal';
// import { useFocusEffect } from '@react-navigation/native';
// import { useIsFocused } from '@react-navigation/native';
// import Loader from '../../Components/atoms/Loader';
// import { apiCall } from '../../service/ApiCall';
// import ApiConstants from '../../service/ApiConstants.json';
// import { useRoute } from '@react-navigation/native';
// import ErrorModal from '../../Components/organisms/ErrorModal';
// //import translate from 'google-translate-api';
// //import {GoogleTranslator} from '@translate-tools/core/translators/GoogleTranslator';

// const JobPosted = ({ navigation }) => {

//   const route = useRoute();
//   const [lang, setLang] = useState('eng');
//   const [dropDown, setDropDown] = useState(false);
//   const [jobTitle, setJobTitle] = useState('');
//   const [hourlyPay, setHourlyPay] = useState('');
//   const [jobDuration, setJobDuration] = useState('');
//   const [jobCategory, setJobCategory] = useState(0);
//   const [jobSubCategory, setJobSubCategory] = useState(0);
//   const [jobDescription, setJobDescription] = useState('');
//   const [jobPostNos, setJobPostNos] = useState('');
//   const [jobPostExpe, setJobPostExpe] = useState('');
//   const [statePicker, setStatePicker] = useState(0);
//   const [city, setCity] = useState(0);
//   const [zipCode, setZipCode] = useState('');
//   const [address, setAddress] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [loader, setLoader] = useState(false);
//   const [missingFieldModal, setMissinFieldModal] = useState(false);
//   const [missingField, setMissingField] = useState(false);
//   const [successModal, setSuccessModal] = useState(false);
//   const [isModal, setisModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(false);
//   const [errorModal, setErrorModal] = useState(false);

//   const dispatch = useDispatch();

//   var job = useSelector(jobPostedSelector);
//   var jobObj = { ...job }

//   const categoryList = useSelector(jobsCategoryList);
//   const subCategoryItems = categoryList.filter(val => val.category_id_decode == jobCategory)[0]?.subcategories

//   const cities = cityStates.filter((value) => value.state == job.state)
//   const cityItems = cities.length > 0 ? cities[0].cities : null

//   var bodyFormData = new FormData();

//   bodyFormData.append('title', jobTitle)
//   bodyFormData.append('category_id', jobCategory)
//   jobSubCategory != 0 && bodyFormData.append('sub_category_id', jobSubCategory)
//   bodyFormData.append('hourly_pay', hourlyPay)
//   bodyFormData.append('duration', jobDuration)
//   bodyFormData.append('description', jobDescription)
//   bodyFormData.append('st_address', address)
//   bodyFormData.append('city', city)
//   bodyFormData.append('state', statePicker)
//   imageUrl != '' && bodyFormData.append('image', { uri: imageUrl, name: 'test_image', type: 'image/*' })
//   bodyFormData.append('zipcode', zipCode)
//   jobPostNos != 0 && bodyFormData.append('no_of_posts', jobPostNos)

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       if ((job.jobTitle != '' || job.address != '' ||
//         job.city != 0 || job.duration != 0 ||
//         job.hourlyPay != '' || job.jobCategory != 0 ||
//         job.jobDescription != '' || job.jobSubCategory != 0 ||
//         job.zipCode != ''
//      ) && (route.name == "JobPosted")) {
//         setisModal(true)
//       }
//       else {
//         setisModal(false)
//       }
//     });
//   }, [navigation, job])

//   useFocusEffect(
//     useCallback(() => {
//       setJobTitle('');
//       setHourlyPay('');
//       setJobDuration(0);
//       setJobCategory(0);
//       setJobSubCategory(0);
//       setImageUrl('');
//       setJobDescription('');
//       setJobPostNos(0);
//       setAddress('');
//       setStatePicker(0);
//       setCity(0);
//       setZipCode('');
//     }, [])
//   )

//   const onCancel = () => {
//     jobObj.jobTitle = '',
//     jobObj.hourlyPay = '',
//     jobObj.duration= 0,
//     jobObj.jobCategory= 0,
//     jobObj.jobSubCategory= 0,
//     jobObj.jobDescription= '',
//     jobObj.noOfEmployees= 0,
//     jobObj.state= 0,
//     jobObj.city= 0,
//     jobObj.zipCode= '',
//     jobObj.address= '',
//     dispatch(setJobPost(jobObj))
//   }

//   async function jobPosted() {

//     try {
//       setLoader(true);

//       var apiResponse = await apiCall(ApiConstants.methods.POST, ApiConstants.endPoints.PostJob, bodyFormData);

//       if (apiResponse.isAxiosError == true) {
//         setErrorMessage(apiResponse.response.data.error.messages.map(val => val+'\n'))
//         setErrorModal(true)
//         setLoader(false)
//       }
//       else {
//         setLoader(false)
//         setErrorModal(false);
//         setSuccessModal(true);
//       }
//     }
//     catch (error) {
//       console.log('Job Posted Catch Body:', error);
//       setLoader(false)
//     }
//   }

//   if (loader == true) {
//     return (
//       <Loader />
//     )
//   }

//   return (
//     <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

//       <ErrorModal
//         isVisible={errorModal}
//         message={errorMessage}
//         onPress={() => setErrorModal(false)}
//       />

//       <CustomModal
//         type='confirmation'
//         isVisible={missingFieldModal}
//         message={'Please fill all the mandatory fields.'}
//         imageSource={require('../../../assets/warning.png')}
//         onPressOk={() => {
//           setMissinFieldModal(false)
//           setMissingField(true)
//         }}
//         buttonText='Ok'
//       />

//       <CustomModal
//         type='confirmation'
//         isVisible={successModal}
//         message={'Job has been successfully created.'}
//         imageSource={require('../../../assets/checked.png')}
//         onPressOk={() => {
//           setMissinFieldModal(false)
//           setMissingField(false)
//           setSuccessModal(false)
//           setJobTitle('')
//           setHourlyPay('')
//           setImageUrl('')
//           setJobDuration(0)
//           setJobCategory(0)
//           setJobSubCategory(0)
//           setJobDescription('')
//           setJobPostNos(0)
//           setJobPostExpe('')
//           setAddress('')
//           setStatePicker(0)
//           setCity(0)
//           setZipCode('')
//           jobObj.jobTitle = '',
//           jobObj.hourlyPay = '',
//           jobObj.duration= 0,
//           jobObj.jobCategory= 0,
//           jobObj.jobSubCategory= 0,
//           jobObj.jobDescription= '',
//           jobObj.noOfEmployees= 0,
//           jobObj.state= 0,
//           jobObj.city= 0,
//           jobObj.zipCode= '',
//           jobObj.address= '',
//           dispatch(setJobPost(jobObj))
//           navigation.navigate(Constants.screen.JobPostedList)
//         }}
//         buttonText='Ok'
//       />

//       <StatusBar backgroundColor={colors.primaryColor} />

//       <ImageBackground source={require('../../../assets/grayBg.jpg')} style={styles.bg}>

//         <HeaderImage style={{ height: Dimensions.get('window').height * 0.15 }} />

//         <HeaderRowContainer>

//           <MenuIcon onPress={() => navigation.openDrawer()} />

//           <ScreenTitle title='Post A Job' />

//           <LanguagePicker
//             viewStyle={{ width: 80 }}
//             containerStyle={{ flex: 1 }}
//             value={lang}
//             setValue={setLang}
//             open={dropDown}
//             setOpen={setDropDown}
//           />

//         </HeaderRowContainer>

//         <View style={styles.infoContainer}>
//           <InputField
//             textStyle={{ color: jobTitle == '' && missingField == true ? 'red' : colors.primaryColor }}
//             title='Job Title'
//             iconName='person'
//             placeholder='Job Title'
//             maxLength={30}
//             value={jobTitle}
//             onChangeText={(val) => {
//               setJobTitle(val)
//               jobObj.jobTitle = val
//               dispatch(setJobPost(jobObj))
//             }}
//           />

//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

//             <InputField
//               textStyle={{ color: hourlyPay == '' && missingField == true ? 'red' : colors.primaryColor }}
//               style={{ flex: 0.45 }}
//               keyboardType={'number-pad'}
//               maxLength={5}
//               title='Hourly Pay'
//               iconName='person'
//               placeholder='0$'
//               value={hourlyPay}
//               onChangeText={(val) => {
//                 setHourlyPay(val)
//                 jobObj.hourlyPay = val
//                 dispatch(setJobPost(jobObj))
//               }}
//             />

//             <CustomPicker
//               pickerTitleStyle={{ color: jobDuration == '' && missingField == true ? 'red' : colors.primaryColor }}
//               pickerContainerStyle={{ marginTop: 10, flex: 0.52 }}
//               // label='Job Type'
//               pickerTitle='Job Type'
//               selectedValue={jobDuration}
//               onValueChange={(itemValue, itemIndex) => {
//                 setJobDuration(itemValue)
//                 jobObj.duration = itemValue
//                 dispatch(setJobPost(jobObj))
//               }}
//             >
//               <Picker.Item label='Part Time' value={'part_time'} style={{fontSize: 14}}/>
//               <Picker.Item label='Full Time' value={'full_time'} style={{fontSize: 14}}/>

//             </CustomPicker>

//           </View>

//           <CustomPicker
//             pickerTitleStyle={{ color: jobCategory == 0 && missingField == true ? 'red' : colors.primaryColor }}
//             pickerContainerStyle={{ marginTop: 10 }}
//             label='Select Job Category'
//             pickerTitle='Job Category'
//             selectedValue={jobCategory}
//             onValueChange={(itemValue, itemIndex) => {
//             setJobCategory(itemValue)
//               jobObj.jobCategory = itemValue
//               dispatch(setJobPost(jobObj))
//               console.log('jjjj',itemValue)
//             }}
//           >

//             {
//               categoryList.map((val, index) => (
//                 <Picker.Item style={{fontSize: 14}} key={index} label={val.name} value={val.category_id_decode} />
//               ))
//             }
//           </CustomPicker>

//           {jobCategory==72? <InputField
//               textStyle={{ color: (subCategoryItems != null && jobSubCategory == 0 && missingField == true) ? 'red' : colors.primaryColor }}
//               style={{ flex: 0.45 }}
//              // keyboardType={'number-pad'}
//              // maxLength={5}
//               title='other'

//               placeholder='Define Category'
//               selectedValue={jobSubCategory}
//               onValueChange={(itemValue, itemIndex) => {
//                 setJobSubCategory(itemValue)
//                 jobObj.jobSubCategory = itemValue
//                 dispatch(setJobPost(jobObj))
//               }}
//             />: <CustomPicker
//             pickerTitleStyle={{ color: (subCategoryItems != null && jobSubCategory == 0 && missingField == true) ? 'red' : colors.primaryColor }}
//             pickerContainerStyle={{ marginTop: 10 }}
//             label='Select Job Sub Category'
//             pickerTitle='Job Sub Category'
//             selectedValue={jobSubCategory}
//             onValueChange={(itemValue, itemIndex) => {
//               setJobSubCategory(itemValue)
//               jobObj.jobSubCategory = itemValue
//               dispatch(setJobPost(jobObj))
//             }}
//           >
//             {
//               subCategoryItems != null ?
//                 subCategoryItems.map((val, index) => (
//                   <Picker.Item style={{fontSize: 14}} key={index} label={val.name} value={val.id} />
//                 ))
//                 : null
//             }
//           </CustomPicker>}

//           <CustomPicker
//             pickerContainerStyle={{ marginTop: 10 }}
//              label='Experience'
//             pickerTitle='Experience '
//             selectedValue={jobPostExpe}
//             onValueChange={(itemValue, itemIndex) => {
//               setJobPostNos(itemValue)
//               jobObj.noOfEmployees = itemValue
//               dispatch(setJobPost(jobObj))
//             }}
//           >
//             <Picker.Item label={'No experience needed'} value={'1'} style={{fontSize: 14}}/>
//             <Picker.Item label={'1 year'} value={'1'} style={{fontSize: 14}}/>
//             <Picker.Item label={'2 year'} value={'2'} style={{fontSize: 14}}/>
//             <Picker.Item label={'More than 2 Years'} value={'3'} style={{fontSize: 14}}/>

//           </CustomPicker>

//           <Text style={styles.uploadImageText}>Upload Image</Text>

//           <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
//             <View style={imageUrl == '' ? styles.EmptyUploadImageContainer : styles.UploadImageContainer}>
//               <MaterialIcons name='cloud-upload' size={18} color={colors.gray} />
//               <Text style={imageUrl == '' ? styles.emptyUploadImageText : { color: colors.gray, opacity: 0.7 }}>Upload Image</Text>
//               {
//                 imageUrl != '' ? <Image source={{ uri: imageUrl }} style={{ height: 40, width: 50, borderRadius: 5 }} />
//                   : null
//               }
//             </View>

//             <Button
//               style={{ backgroundColor: colors.primaryColor, padding: 5, borderRadius: 15, height: Dimensions.get('window').height * 0.065 }}
//               titleStyle={{ marginLeft: 5 }}
//               iconName={'cloud-upload'}
//               title='Upload'
//               onPress={() => {
//                 let options;
//                 launchImageLibrary(options = {
//                   mediaType: 'photo',
//                   maxHeight: 500,
//                   maxWidth: 500
//                   //includeBase64: true
//                 }, (response) => {
//                   //console.log('Response:',response)

//                   if (response.didCancel) {
//                     console.log('User cancelled image picker');
//                     setImageUrl('')
//                   } else if (response.errorMessage) {
//                     console.log('Error:', response.errorMessage)
//                   } else {
//                     const source = response?.assets[0].uri
//                     //const source = { uri: response.assets[0].uri }
//                     setImageUrl(source)
//                     //setImageFileName(response.assets[0].fileName)
//                   }
//                 })
//               }}
//             />
//           </View>

//           <InputField
//             textStyle={{ color: jobDescription == '' && missingField == true ? 'red' : colors.primaryColor }}
//             title='Description'
//             placeholder='Job Description'
//             maxLength={250}
//             multiline={true}
//             inputFieldStyle={{ alignItems: 'flex-start', height: Dimensions.get('window').height * 0.2 }}
//             value={jobDescription}
//             onChangeText={(val) => {
//               setJobDescription(val)
//               jobObj.jobDescription = val
//               dispatch(setJobPost(jobObj))
//             }}
//           />
//           <Text style={{ alignSelf: 'flex-end', color: colors.darkGray, fontWeight: 'bold', fontSize: 12 }}>
//             {`${jobDescription.length} / 250 Characters`}
//           </Text>

//           <CustomPicker
//             pickerContainerStyle={{ marginTop: 10 }}
//             label='Select No. Of Employees'
//             pickerTitle='No. Of Employees'
//             selectedValue={jobPostNos}
//             onValueChange={(itemValue, itemIndex) => {
//               setJobPostNos(itemValue)
//               jobObj.noOfEmployees = itemValue
//               dispatch(setJobPost(jobObj))
//             }}
//           >
//             <Picker.Item label={'1'} value={'1'} style={{fontSize: 14}}/>
//             <Picker.Item label={'2'} value={'2'} style={{fontSize: 14}}/>
//             <Picker.Item label={'3'} value={'3'} style={{fontSize: 14}}/>
//             <Picker.Item label={'4'} value={'4'} style={{fontSize: 14}}/>
//             <Picker.Item label={'5'} value={'5'} style={{fontSize: 14}}/>
//           </CustomPicker>

//           <InputField
//             inputFieldStyle={address.length > 35 && {height: Dimensions.get('window').height * 0.078}}
//             textStyle={{ color: address == '' && missingField == true ? 'red' : colors.primaryColor }}
//             title='Address'
//             placeholder='Address'
//             iconName='location-sharp'
//             maxLength={50}
//             multiline={address.length > 35 ? true : false}
//             value={address}
//             onChangeText={(val) => {
//               setAddress(val)
//               jobObj.address = val
//               dispatch(setJobPost(jobObj))
//             }}
//           />

//           <StatePicker
//             pickerTitleStyle={{ color: statePicker == 0 && missingField == true ? 'red' : colors.primaryColor }}
//             pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
//             items={cityStates}
//             selectedValue={statePicker}
//             onValueChange={(itemValue, itemIndex) => {
//               setStatePicker(itemValue)
//               jobObj.state = itemValue
//               dispatch(setJobPost(jobObj))
//             }}
//           />

//           <CustomPicker
//             pickerTitleStyle={{ color: city == 0 && missingField == true ? 'red' : colors.primaryColor }}
//             pickerContainerStyle={{ marginTop: 10, flex: 0.49 }}
//             label='Select City'
//             pickerTitle='City'
//             selectedValue={city}
//             onValueChange={(itemValue, itemIndex) => {
//               setCity(itemValue)
//               jobObj.city = itemValue
//               dispatch(setJobPost(jobObj))
//             }}
//           >
//             {
//               cities.length > 0 ?
//                 cityItems.map((val, index) => (
//                   <Picker.Item
//                     style={{fontSize: 14}}
//                     key={index}
//                     label={val.city}
//                     value={val.city}
//                   />
//                 ))
//                 : null
//             }
//           </CustomPicker>

//           <InputField
//             textStyle={{ color: zipCode == '' && missingField == true ? 'red' : colors.primaryColor }}
//             keyboardType={'number-pad'}
//             maxLength={5}
//             title='Zip Code'
//             placeholder='Zip Code'
//             value={zipCode}
//             onChangeText={(val) => {
//               setZipCode(val)
//               jobObj.zipCode = val
//               dispatch(setJobPost(jobObj))
//             }}
//           />

//           <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 7 }}>
//             <TouchableOpacity
//               onPress={() => Linking.openURL(`https://www.google.com/maps/search/'${address}, ${city}, ${statePicker}, ${zipCode}`).catch(err => console.error('An error occurred', err))}
//             >
//               <Text style={{ fontSize: 12, color: colors.buttonColor }}>Click here to view full address</Text>
//             </TouchableOpacity>

//             <MaterialIcons name='location-city' size={20} color={colors.primaryColor} style={{ marginLeft: 3 }} />

//           </View>

//         </View>

//         <View style={styles.bottomButtonContainer}>

//           <Button
//             style={{ ...styles.button, backgroundColor: colors.primaryColor }}
//             title='Post'
//             onPress={() => {
//               if (jobTitle == '' || hourlyPay == '' || jobDuration == 0 || jobCategory == 0 || jobDescription == '' || address == '' || statePicker == 0 || city == 0 || zipCode == '') {
//                 setMissinFieldModal(true)
//               }
//               else {
//                 jobPosted()
//               }
//             }}
//           />

//           <Button
//             style={styles.button}
//             title='Cancel'
//             onPress={() => {
//               navigation.navigate(Constants.screen.EmployerDashboard)
//               onCancel()
//             }}
//           />

//         </View>

//       </ImageBackground>

//       {isModal &&
//         <CustomModal
//           message={"You have an unposted job."}
//           isVisible={isModal}
//           imageSource={require('../../../assets/diagnostic.png')}
//           onPressYes={() => {
//             setisModal(false)
//             navigation.navigate(Constants.screen.Draft)
//           }}
//           onPressNo={() => setisModal(false)}
//         />
//       }

//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   bg: {
//     flex: 1,
//     width: Dimensions.get('window').width
//   },
//   screenTitle: {
//     alignSelf: 'center',
//     marginTop: 20,
//     color: colors.white,
//     fontSize: 22,
//     fontWeight: 'bold'
//   },
//   infoContainer: {
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     marginVertical: 9,
//     marginHorizontal: 9,
//     padding: 10
//   },
//   picker: {
//     marginTop: 4,
//     height: Dimensions.get('window').height * 0.065,
//     borderRadius: 15,
//     borderWidth: 1.5,
//     borderColor: colors.gray,
//     justifyContent: 'center'
//   },
//   emptyUploadImageText: {
//     color: colors.gray,
//     opacity: 0.7,
//     marginLeft: 7
//   },
//   chooseFileButton: {
//     //flexDirection: 'column',
//     height: Dimensions.get('window').height * 0.06,
//     marginTop: 15,
//     borderRadius: 15,
//     backgroundColor: colors.primaryColor,
//     padding: 5
//     //flex: 0.45
//     //width: 130
//   },
//   picker: {
//     marginTop: 4,
//     height: Dimensions.get('window').height * 0.065,
//     borderRadius: 15,
//     borderWidth: 1.5,
//     borderColor: colors.gray,
//     justifyContent: 'center'
//   },
//   mapView: {
//     marginTop: 20,
//     overflow: 'hidden',
//     height: Dimensions.get('window').height * 0.15,
//     borderRadius: 15,
//     borderWidth: 1.5,
//     borderColor: 'gray'
//   },
//   bottomButtonContainer: {
//     flexDirection: 'row',
//   },
//   button: {
//     flex: 1,
//     borderRadius: 0,
//     height: Dimensions.get('window').height * 0.085,
//   },
//   uploadImageText: {
//     marginLeft: 7,
//     marginTop: 10,
//     fontWeight: 'bold',
//     color: colors.primaryColor
//   },
//   EmptyUploadImageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     borderColor: colors.gray,
//     borderWidth: 1.5,
//     flex: 0.93,
//     height: Dimensions.get('window').height * 0.065
//   },
//   UploadImageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     borderRadius: 15,
//     borderColor: colors.gray,
//     borderWidth: 1.5,
//     flex: 0.93,
//     height: Dimensions.get('window').height * 0.065
//   }
// })

// export default JobPosted;
