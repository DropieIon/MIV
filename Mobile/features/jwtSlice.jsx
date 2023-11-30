import { createSlice } from "@reduxjs/toolkit";

export const jwtSlice = createSlice({
    name: 'jwt',
    initialState: {
        token: ""
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
    }
});

export const { setToken } = jwtSlice.actions;
export default jwtSlice.reducer;

export const selectToken = (state) => state.token;