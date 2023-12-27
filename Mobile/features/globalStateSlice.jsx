import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
    name: 'global',
    initialState: {
        token: "",
        isMedic: false,
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
        setIsMedic: (state, action) => {
            state.isMedic = action.payload;
        },
        setOpenViewer: (state, action) => {
            state.openViewer = action.payload;
        },
        setLoadingProgress: (state, action) => {
            state.loadingProgress[action.payload.index] = action.payload.length
        }
    }
});

export const { setToken, setIsMedic, setOpenViewer, setLoadingProgress } = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectIsMedic = (state) => state.isMedic;
export const selectOpenViewer = (state) => state.openViewer;
export const selectLoadingProgress = (state) => state.loadingProgress;