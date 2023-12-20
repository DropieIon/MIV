import { createSlice } from "@reduxjs/toolkit";

export const globalStateSlice = createSlice({
    name: 'jwt',
    initialState: {
        token: "",
        isMedic: false,
        openViewer: false,
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
        }
    }
});

export const { setToken, setIsMedic, setOpenViewer } = globalStateSlice.actions;
export default globalStateSlice.reducer;

export const selectToken = (state) => state.token;
export const selectIsMedic = (state) => state.isMedic;
export const selectOpenViewer = (state) => state.openViewer;