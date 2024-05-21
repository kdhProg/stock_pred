// src/redux/stringSlice.js
import { createSlice } from '@reduxjs/toolkit';

const stringSlice = createSlice({
    name: 'string',
    initialState: { value: '' },
    reducers: {
        updateString: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { updateString } = stringSlice.actions;
export default stringSlice.reducer;
