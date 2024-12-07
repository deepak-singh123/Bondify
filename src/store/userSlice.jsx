import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoggedIn: false
};

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async () => {
        const response = await fetch("http://localhost:3000/auth/isloggedin", {
            method: "POST",
            credentials: 'include',  // Important for cookies
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        return result;
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
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoggedIn = action.payload.isLoggedin;
            })
    }
});

export const { setUser, clearUser, setLoggedIn } = userSlice.actions;
export default userSlice.reducer;