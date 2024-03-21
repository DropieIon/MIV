import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
    name: 'global',
    initialState: {
        token: "",
        loadStudies: false,
        openViewer: {
            should_open: false,
            study_id: ""
        },
        loadingProgress: [],
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setLoadStudies: (state, action) => {
            state.loadStudies = action.payload;
        },
        setOpenViewer: (state, action) => {
            state.openViewer = action.payload;
        },
        setLoadingProgress: (state, action) => {
            state.loadingProgress[action.payload.index] = action.payload.length
        }
    }
});

export const { setToken, setLoadStudies, setOpenViewer, setLoadingProgress } = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectLoadStudies = (state) => state.loadStudies;
export const selectOpenViewer = (state) => state.openViewer;
export const selectLoadingProgress = (state) => state.loadingProgress;