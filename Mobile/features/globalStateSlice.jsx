import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
    name: 'global',
    initialState: {
        token: "",
        tokenRefreshRef: null,
        serverAddress: "http://192.168.1.201:8000",
        openViewer: {
            should_open: false,
            study_id: ""
        },
        loadingProgress: [],
        currentAccountFullName: "",
        // used for chat
        currentAccountUsername: "",
        chatNewMessage: null,
        chatPfps: [],
        myPfp: "",
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
            type: "personal",
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
        setServerAddress: (state, action) => {
            state.serverAddress = action.payload;
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
        setChatPfps: (state, action) => {
            state.chatPfps = action.payload;
        },
        setCurrentAccountUsername: (state, action) => {
            state.currentAccountUsername = action.payload;
        },
        setChatData: (state, action) => {
            state.chatData = action.payload;
        },
        setMyPfp: (state, action) => {
            state.myPfp = action.payload;
        },
        setViewStudies: (state, action) => {
            state.viewStudies = action.payload;
        },
        setReq_study_id: (state, action) => {
            state.req_study_id = action.payload;
        },
        setChatNewMessage: (state, action) => {
            state.chatNewMessage = action.payload;
        },
    }
});

export const {
    setToken,
    setTokenRefreshRef,
    setServerAddress,
    setOpenViewer,
    setLoadingProgress,
    setRefreshList,
    setAccountDetails,
    setViewStudies,
    setChatPfps,
    setMyPfp,
    setChatNewMessage,
    setCurrentAccountFullName,
    setCurrentAccountUsername,
    setReq_study_id,
} = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectTokenRefreshRef = (state) => state.tokenRefreshRef;
export const selectOpenViewer = (state) => state.openViewer;
export const selectServerAddress = (state) => state.serverAddress;
export const selectLoadingProgress = (state) => state.loadingProgress;
export const selectFullName = (state) => state.accountDetails.fullName;
export const selectAccountDetails = (state) => state.accountDetails;
export const selectChatPfps = (state) => state.chatPfps;
export const selectMyPfp = (state) => state.myPfp;
export const selectChatNewMessage = (state) => state.chatNewMessage;
export const selectCurrentAccountFullName = (state) => state.currentAccountFullName;
export const selectCurrentAccountUsername = (state) => state.currentAccountUsername;
export const selectViewStudies = (state) => state.viewStudies;
export const selectReq_study_id = (state) => state.req_study_id;