import { createSlice } from "@reduxjs/toolkit";
import { defaultPfp } from "../configs/defaultUser.b64";

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
        patDetails: {
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
        patientUid: "",
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
        setPatDetails: (state, action) => {
            state.patDetails = action.payload;
        },
        setPatientUid: (state, action) => {
            state.patientUid = action.payload;
        },
    }
});

export const {
    setToken,
    setTokenRefreshRef,
    setOpenViewer,
    setLoadingProgress,
    setRefreshList,
    setPatDetails,
    setPatientUid
} = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectTokenRefreshRef = (state) => state.tokenRefreshRef;
export const selectOpenViewer = (state) => state.openViewer;
export const selectLoadingProgress = (state) => state.loadingProgress;
export const selectFullName = (state) => state.patDetails.fullName;
export const selectPatDetails = (state) => state.patDetails;
export const selectPatientUid = (state) => state.patientUid;