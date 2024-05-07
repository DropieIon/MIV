import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
    name: 'global',
    initialState: {
        token: "",
        tokenRefreshRef: null,
        openViewer: {
            should_open: false,
            study_id: ""
        },
        loadingProgress: [],
        currentAccountFullName: "",
        accountDetails: {
            fullName: "",
            username: "",
            sex: "M",
            age: 0,
            profile_pic: "",
            nrOfStudies: 0,
        },
        // used for exiting the viewer
        // and knowing which patient was
        // last clicked
        viewStudies: {
            type: "",
            patientID: "",
        },
        // used for unassigned studies
        req_study_id: "",
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setTokenRefreshRef: (state, action) => {
            state.tokenRefreshRef = action.payload;
        },
        setOpenViewer: (state, action) => {
            state.openViewer = action.payload;
        },
        setLoadingProgress: (state, action) => {
            state.loadingProgress[action.payload.index] = action.payload.length;
        },
        setAccountDetails: (state, action) => {
            state.accountDetails = action.payload;
        },
        setCurrentAccountFullName: (state, action) => {
            state.currentAccountFullName = action.payload;
        },
        setViewStudies: (state, action) => {
            state.viewStudies = action.payload;
        },
        setReq_study_id: (state, action) => {
            state.req_study_id = action.payload;
        },
    }
});

export const {
    setToken,
    setTokenRefreshRef,
    setOpenViewer,
    setLoadingProgress,
    setRefreshList,
    setAccountDetails,
    setViewStudies,
    setCurrentAccountFullName,
    setReq_study_id,
} = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectTokenRefreshRef = (state) => state.tokenRefreshRef;
export const selectOpenViewer = (state) => state.openViewer;
export const selectLoadingProgress = (state) => state.loadingProgress;
export const selectFullName = (state) => state.accountDetails.fullName;
export const selectAccountDetails = (state) => state.accountDetails;
export const selectCurrentAccountFullName = (state) => state.currentAccountFullName;
export const selectViewStudies = (state) => state.viewStudies;
export const selectReq_study_id = (state) => state.req_study_id;