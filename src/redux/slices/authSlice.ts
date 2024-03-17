import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle, signInWithFacebook, signOutUser } from "@/lib/firebase/firebaseConfig";
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';

export const login = createAsyncThunk(
  'auth/login',
  async (provider: string) => {
    const user = provider === 'google' ? await signInWithGoogle() : await signInWithFacebook();
    if (user) {
      const usersData = await fetchDataFromCollection('users');
      const loggedInUser = usersData.find(u => u.mail === user.email);
      if (loggedInUser) {
        return { isAuthenticated: true, user: loggedInUser };
      }
    }
    throw new Error('Authentication failed');
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await signOutUser();
    return { isAuthenticated: false, user: null };
  }
);

const initialState: any = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserState(state, action) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'idle';
      });
  }
});

export default authSlice.reducer;
export const { setUserState } = authSlice.actions;
