import { createSlice } from '@reduxjs/toolkit';

export const toggleSlice = createSlice({
  name: 'toggle',
  initialState: {
    isToggle: false,
  },
  reducers: {
    trueToggle: (state) => {
      state.isToggle = true;
    },
    falseToggle: (state) => {
      state.isToggle = false;
    },
  },
});

export const { trueToggle, falseToggle } = toggleSlice.actions;

export default toggleSlice.reducer;
