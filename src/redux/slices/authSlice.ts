import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle, signInWithTwitter, signOutUser } from "@/lib/firebase/firebaseConfig";
import { fetchDataFromCollection } from '@/lib/firebase/firebaseGetDocs';
import { updateUserDataInFirebase } from "@/lib/firebase/firebaseFunctions";
import Cookies from 'js-cookie';


export const getUser = async (id: string) => {
  const usersData = await fetchDataFromCollection('users');
  return usersData.find(u => u.mail === id);
}


export const login = createAsyncThunk(
  'auth/login',
  async (provider: string) => {
    const user = provider === 'google' ? await signInWithGoogle() : await signInWithTwitter();

    if (user) {
      const usersData = await fetchDataFromCollection('users');
      const loggedInUser = await getUser((user.mail || user.email) as string);
      if (loggedInUser) {
        Cookies.set('user', JSON.stringify(loggedInUser), { expires: 7 });
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


export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, isPsychologist }: { userId: string; isPsychologist: boolean }, thunkAPI) => {
    const role = isPsychologist ? 'psy' : 'user';
    try {
      await updateUserDataInFirebase(userId, { role });
      thunkAPI.dispatch(setUserRole(role));
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserState(state, action) {
      if (action.payload.user) {
        state.user = { ...state.user, ...action.payload.user };
      }
      state.isAuthenticated = action.payload.isAuthenticated !== undefined ? action.payload.isAuthenticated : state.isAuthenticated;
    },
    setUserRole(state, action) {
      state.user.role = action.payload;
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
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
      });
  }
});


export default authSlice.reducer;
export const { setUserState, setUserRole } = authSlice.actions;
