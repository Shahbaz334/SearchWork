import { StyleSheet } from 'react-native';
import colors from '../Constants/colors';

export default commonStyles = StyleSheet.create({
  jobCardContainer:{
    marginBottom: 10,
    padding: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
    backgroundColor: colors.white,
    flexDirection: 'row'
  },
  jobImageContainer: {
    overflow: 'hidden',
    height: 120,
    width: 120,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  jobCardImage:{
    height: 100,
    width: 100,
  },
  jobCardTitle:{
    color: colors.darkGray, 
    fontSize: 16, 
    fontWeight: 'bold', 
    flex: 1, 
    marginRight: 5
  },
  jobIconsContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  jobListingFlatListContainer:{
    flex: 1,
    marginTop: 10
  },
  headerBgImage:{
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
});