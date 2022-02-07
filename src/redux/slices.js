import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobPosted: {
    jobTitle: '',
    hourlyPay: '',
    duration: 0,
    jobCategory: 0,
    jobSubCategory: 0,
    requiredLanguage: 0,
    requiredExperience: 0,
    jobDescription: '',
    noOfEmployees: 0,
    state: 0,
    city: 0,
    zipCode: '',
    address: '',
  },
  token:'',
  userDetails: null,
  rememberMeCheck: false,
  userCredentials: {
    email: '',
    password: ''
  },
  jobsCategory: [],
  jobsList : [],
  viewJob: null,
  savedJobList: [],
  applicants: [],
  profile: null,
  loggedInProfile: null,
  languageSelected: 'en'
}

export const slices = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setJobPost: (state, action) => {
      state.jobPosted = action.payload;
    },

    login: (state, action) => {
      state.userDetails = action.payload
    },

    token: (state, action) => {
      state.token = action.payload
    },

    saveUserCredential: (state, action) => {
      state.userCredentials = action.payload
    },

    isRememberMe: (state, action) => {
      state.rememberMeCheck = action.payload
    },

    getJobCategory: (state, action) => {
      state.jobsCategory = action.payload
    },
    
    // getRequiredLanguage: (state, action) => {
    //   state.requiredLanguage = action.payload
    // },
    
    // getrequiredExperience: (state, action) => {
    //   state.requiredExperience = action.payload
    // },

    getJobList: (state, action) => {
      state.jobsList = action.payload
    },
    
    getViewJob: (state, action) => {
      state.viewJob = action.payload
    },
    
    getSaveJobList: (state, action) => {
      state.savedJobList = action.payload
    },
    
    getApplicantsList: (state, action) => {
      state.applicants = action.payload
    },
    
    getProfile: (state, action) => {
      state.profile = action.payload
    },
    
    getLoggedInProfile: (state, action) => {
      state.loggedInProfile = action.payload
    },
    
    setLanguage: (state, action) => {
      state.languageSelected = action.payload
    },
  }
});

export const { 
  setJobPost, 
  login, 
  token,
  isRememberMe, 
  saveUserCredential, 
  getJobCategory, 
  // getRequiredLanguage, 
  // getrequiredExperience, 
  getJobList, 
  getViewJob, 
  getSaveJobList, 
  getApplicantsList, 
  getProfile, 
  getLoggedInProfile,
  setLanguage
} = slices.actions;
 

//Selectors
export const jobPostedSelector = (state) => state.nav.jobPosted;
export const userLogin = (state) => state.nav.userDetails;
export const authToken = (state) => state.nav.token;
export const rememberMeOperation = (state) => state.nav.rememberMeCheck;
export const userCredential = (state) => state.nav.userCredentials;
export const jobsCategoryList = (state) => state.nav.jobsCategory;
// export const requiredLanguageList = (state) => state.nav.requiredLanguage;
// export const requiredExperienceList = (state) => state.nav.requiredExperience;
export const jobsListing = (state) => state.nav.jobsList;
export const jobViewDetails = (state) => state.nav.viewJob;
export const savedJobsList = (state) => state.nav.savedJobList;
export const applicants = (state) => state.nav.applicants;
export const applicantProfile = (state) => state.nav.profile;
export const loginUserProfile = (state) => state.nav.loggedInProfile;
export const setLanguageSelected = (state) => state.nav.languageSelected

export default slices.reducer;