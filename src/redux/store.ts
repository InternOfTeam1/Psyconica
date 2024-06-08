import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/redux/slices/authSlice';
import modalReducer from "@/redux/slices/modalSlice";
import toggleReducer from "@/redux/slices/toggleSlice";
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    toggle: toggleReducer
  }
})


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
