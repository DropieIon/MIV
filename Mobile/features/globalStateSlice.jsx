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
        fullName: "",
        // used for exiting the viewer
        patientUid: ""
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
            state.loadingProgress[action.payload.index] = action.payload.length
        },
        setFullName: (state, action) => {
            state.fullName = action.payload;
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
    setFullName,
    setPatientUid
} = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectTokenRefreshRef = (state) => state.tokenRefreshRef;
export const selectOpenViewer = (state) => state.openViewer;
export const selectLoadingProgress = (state) => state.loadingProgress;
export const selectFullName = (state) => state.fullName;
export const selectPatientUid = (state) => state.patientUid;