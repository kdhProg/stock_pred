// src/redux/stringSlice.js
import { createSlice } from '@reduxjs/toolkit';

const stringSlice = createSlice({
    name: 'string',
    initialState: { schStockKeyword: '', choStockKeyword: ''  },
    reducers: {
        updateSchKW: (state, action) => {
            state.schStockKeyword = action.payload;
        },
        updateChoKW: (state, action) => {
            state.choStockKeyword = action.payload;
        }
    }
});

export const { updateSchKW, updateChoKW } = stringSlice.actions;
export default stringSlice.reducer;
