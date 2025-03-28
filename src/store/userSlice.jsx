import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoggedIn: false
};
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`/auth/isloggedin`, {
                method: "POST", 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Authentication check failed');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoggedIn = action.payload.isLoggedin;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.user = null;
                state.isLoggedIn = false;
            })
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;