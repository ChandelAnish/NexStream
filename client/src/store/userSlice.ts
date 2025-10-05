import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface UserState {
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  email: null,
  loading: false,
  error: null,
};

// Optional: Async thunk to fetch user profile (e.g., based on email)
export const fetchUserByEmail = createAsyncThunk(
  'user/fetchByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user?email=${encodeURIComponent(email)}`);
      return response.data; // assume response contains { email: string }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action: PayloadAction<{ email: string }>) => {
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(fetchUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEmail, resetUser } = userSlice.actions;
export default userSlice.reducer;
