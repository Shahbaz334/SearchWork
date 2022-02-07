import React, { useRef,useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View, Alert, PermissionsAndroid, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import CompanyLabel from '../../Components/atoms/CompanyLabel';
import Divider from '../../Components/atoms/Divider';
import Heading from '../../Components/atoms/Haeding';
import IconText from '../../Components/atoms/IconText';
import Logo from '../../Components/atoms/Logo';
import ProfilePicture from '../../Components/atoms/ProfilePicture';
import colors from '../../Constants/colors';
import { loginUserProfile } from '../../redux/slices';
import ViewShot from 'react-native-view-shot';
import RNImageToPdf from 'react-native-image-to-pdf';
import LanguagePicker from '../../Components/organisms/LanguagePicker';
import RNFetchBlob from 'rn-fetch-blob';
import { apiCall } from '../../service/ApiCall';
import ApiConstants from '../../service/ApiConstants.json';
import RNFS from 'react-native-fs'
import axios from "axios"
import LocalStrings from '../../Language/Strings'
const EmployeeResume =() => {
  const [dropDown, setDropDown] = useState(false);
  const [lang, setLang] = useState('eng');

  const pdf_ApiCall=async (pdf)=>{
    const form = new FormData();
    form.append('file',pdf)
    console.log("form",pdf);
try{

  const rawResponse = await axios.post('https://admin2.sadpoetrylive.com/api/upload-files',form, {
    headers: {
      'Accept': 'application/json',
     'Content-Type':' multipart/form-data'
    },
  });
  console.log("rawResponse",rawResponse);
  // const content = await rawResponse.json();
    // const pdf_Api=await apiCall(
    //   ApiConstants.methods.POST,
    //   ApiConstants.endPoints.upload_files,
    //   form
    // )
    // console.log('pdf_api',pdf_Api);
}
catch (error){
  console.log(error)
}
  }



  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const ViewShotRef = useRef()
  async function captureViewShot() {
    try {
    const resume = await ViewShotRef.current.capture()
    // const resume = `data:image/jpeg;base64,${base64}`
   console.log('resume',resume.slice(8));
    const options = {
      imagePaths: [resume.slice(8)],
      name: 'PDFName'+parseInt(Math.random() * (1000 - 1) + 1)+".pdf",
      maxSize: { // optional maximum image dimension - larger images will be resized
        width: 900,
        height: 900,
      },
      quality: .7, // optional compression paramter
    };
    const pdf = await RNImageToPdf.createPDFbyImages(options);
    console.log(pdf.filePath);
    // pdf_ApiCall({uri:`file:///data/user/0/com.searchwork/files/${options.name}`, name: 'pdf', type: 'pdf', });
    // checkPermission(options.name)
    alert('File saved successfully at ' + JSON.stringify(pdf.filePath))
    } catch (error) {
      console.log('pd)ddddf error',error);
    }
    

    // checkPermission(pdf.filePath)

    // console.log(resume)
  }

  const checkPermission = async (image) => {
    console.log('ssss', image)
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile(image);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          // downloadFile(image);
          const fs = RNFetchBlob.fs;
          // const base64 = RNFetchBlob.base64;

          const dirs = RNFetchBlob.fs.dirs;

          // const NEW_FILE_PATH = dirs.DownloadDir + image;
          // fs.createFile(NEW_FILE_PATH, 'foo', 'utf8');
         console.log("filepath",`${RNFS.DocumentDirectoryPath}/${image}`);
         console.log("other",`${RNFS.ExternalStorageDirectoryPath}/Download`);
         
         const res=await RNFS.moveFile(`${RNFS.ExternalStorageDirectoryPath}/Android/data/com.searchwork/files/${image}`,`${RNFS.ExternalStorageDirectoryPath}/Download`)

          console.log('Storage Permission Granted.',res);
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };
//   const downloadFile = (image) => {

//     // Get today's date to add the time suffix in filename
//     let date = new Date();
//     // File URL which we want to download
//     let FILE_URL = image;
//     console.log('asdf1',FILE_URL)
//     // Function to get extention of the file url
//     let file_ext = getFileExtention(FILE_URL);
//     console.log('asdf2',file_ext)
//     // file_ext = '.' + file_ext[0];     needed be updated
//     file_ext = '.pdf'

//     // config: To get response by passing the downloading related options
//     // fs: Root directory path to download
//     const { config, fs } = RNFetchBlob;
//     let RootDir = fs.dirs.PictureDir;
//     let options = {
//       fileCache: true,
//       addAndroidDownloads: {
//         path:
//           RootDir +
//           '/file_' +
//           Math.floor(date.getTime() + date.getSeconds() / 2) +
//           file_ext,
//         description: 'downloading file...',
//         notification: true,
//         // useDownloadManager works with Android only
//         useDownloadManager: true,
//       },
//     };
//     config(options)
//       .fetch('GET', FILE_URL)
//       .then(res => {
//         // Alert after successful downloading
//         console.log('res -> ', JSON.stringify(res));
//         Toast.show('File Downloaded Successfully.');
//       });
//   };
//   const getFileExtention = fileUrl => {
//     // To get the file extension
//     return /[.]/.exec(fileUrl) ?
//         /[^.]+$/.exec(fileUrl) : undefined;
// };



  const userProfile = useSelector(loginUserProfile)


  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.lightGray }} showsVerticalScrollIndicator={false}>
      <ViewShot ref={ViewShotRef} style={{ flex: 1 }} options={{ format: 'jpg', quality: 1.0, result: "tmpfile" }} >
        <View style={styles.resumeContainer}>

          <View style={styles.rowContainer}>

            <View style={styles.leftColumn}>

              <View style={{ backgroundColor: colors.primaryColor, borderTopLeftRadius: 20, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, height: 200, justifyContent: 'center', paddingBottom: 40, alignItems: 'center' }}>
                <Logo style={[styles.logo, { transform: [{ rotate: '-25deg' }] }]} />
              
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={{ position: 'absolute', top: -50 }}>
                  <ProfilePicture
                    imageSource={userProfile?.image_urls['3x']}
                    imageStyle={{ height: 80, width: 80, borderRadius: 40, borderColor: colors.white, borderWidth: 2 }}
                    disabled={true}
                    iconSize={30}
                  />
                </View>
              </View>

              <Heading
                title={LocalStrings.CONTACT_ME}
                style={{ marginTop: 65, marginBottom: 7, alignSelf: 'flex-start', width: '100%', backgroundColor: colors.primaryColor, alignItems: 'center' }}
                textStyle={{ color: colors.white, fontWeight: 'bold' }}
              />

              <IconText text={userProfile?.email}>
                <Ionicons name='mail' size={16} color={colors.white} />
              </IconText>

              <IconText text={userProfile?.phone}>
                <Ionicons name='phone-portrait' size={16} color={colors.white} />
              </IconText>


              <Heading
                title={LocalStrings.address}
                style={{ marginTop: 35, marginBottom: 7, alignSelf: 'flex-start', width: '100%', backgroundColor: colors.primaryColor, alignItems: 'center' }}
                textStyle={{ color: colors.white, fontWeight: 'bold' }}
              />

              <IconText text={`${userProfile?.address}, ${userProfile?.city}, ${userProfile?.state}, ${userProfile?.zipcode}`}>
                <Ionicons name='md-location-sharp' size={16} color={colors.white} />
              </IconText>

              {
                userProfile?.languages != null &&

                <>
                  <Heading
                    title={LocalStrings.Language}
                    style={{ marginTop: 35, marginBottom: 7, alignSelf: 'flex-start', width: '100%', backgroundColor: colors.primaryColor, alignItems: 'center' }}
                    textStyle={{ color: colors.white, fontWeight: 'bold' }}
                  />

                  <IconText text={userProfile?.languages}>
                    <FontAwesome name='language' size={16} color={colors.white} />
                  </IconText>

                </>
              }

            </View>

            <View style={styles.rightColumn}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
                <Text style={styles.name}>{userProfile?.name}</Text>
                <Image source={require('../../../assets/resumeChip.png')} resizeMode='contain' style={{ width: 40, height: 80 }} />
              </View>

              {
                userProfile?.objective != null &&
                <>

                  <View style={styles.headingContainer}>
                    <FontAwesome name='user' size={25} color={colors.primaryColor} />
                    <Text style={styles.heading}>Objective</Text>
                  </View>
                  <Divider style={{ marginTop: 5 }} />

                  <Text style={{ fontSize: 13, marginRight: 4, marginTop: 7 }}>
                    {userProfile?.objective}
                  </Text>

                </>
              }

              {
                userProfile?.experience != null &&
                <>

                  <View style={styles.headingContainer}>
                    <FontAwesome name='briefcase' size={25} color={colors.primaryColor} />
                    <Text style={styles.heading}>Experience</Text>
                  </View>
                  <Divider style={{ marginTop: 5 }} />

                  <View style={styles.descriptionContainer}>
                    <View style={styles.dot} />
                    <Text style={styles.descriptionText}>{userProfile?.experience}</Text>
                  </View>
                </>
              }
              
              <TouchableOpacity style={styles.print} onPress={captureViewShot}>
                <Text style={{ fontSize: 15, color: 'white' }}>{LocalStrings.Print_Cv}</Text>
              </TouchableOpacity>
              
            </View>



          </View>

          <View style={styles.bottomContainer}>
            <CompanyLabel style={{ color: colors.white }} />
            <Logo style={styles.logo} />

          </View>

        </View>
      </ViewShot>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bg: {
    height: Dimensions.get('screen').height + 70,
    width: Dimensions.get('window').width
  },
  resumeContainer: {
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 10,
    //marginTop: 20,
    backgroundColor: colors.white
  },
  rowContainer: {
    flexDirection: 'row',
    height: 850
  },
  leftColumn: {
    width: Dimensions.get('window').width * 0.35,
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: 20,
  },
  rightColumn: {
    marginHorizontal: 10,
    flex: 1
  },
  name: {
    marginTop: 40,
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.primaryColor,
    flex: 1,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 6
  },
  dot: {
    marginTop: 8,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryColor
  },
  pictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: '#C5C4C7'
  },
  bottomContainer: {
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.primaryColor,
    width: '100%',
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  print: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
    width: 90,
    height: 40,
    borderRadius: 10,
    
    // marginTop: Dimensions.get('window').height * 0.55,
    alignSelf: 'flex-end'
    // position:"absolute",
    // bottom:150
  },
  logo: {
    height: 50,
    width: 110,
    resizeMode: 'contain'
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  descriptionText: {
    marginLeft: 6,
    fontSize: 13,
    marginRight: 4
  },
  button: {
    flex: 0.5,
    height: Dimensions.get('screen').height * 0.08,
    borderTopLeftRadius: 30,
    borderRadius: 0,
    backgroundColor: colors.primaryColor
  },
});

export default EmployeeResume;
