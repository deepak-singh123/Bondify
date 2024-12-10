import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    curruserposts: [],
    connectionposts: [],
    allusersposts: [],
    loading: false,
    error: null
};

export const fetchuserposts = createAsyncThunk(
    'userpost/fetchuserposts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/user/post/allposts", {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return rejectWithValue('Failed to fetch posts');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userpostSlice = createSlice({
    name: 'userposts',
    initialState,
    reducers: {
        adduserpost: (state, action) => {
            state.curruserposts = action.payload;
        },
        removeuserpost: (state) => {
            state.curruserposts = [];
        },
        addconnectionpost: (state, action) => {
            state.connectionposts = action.payload;
        },
        removeconnectionpost: (state) => {
            state.connectionposts = [];
        },
        addalluserspost: (state, action) => {
            state.allusersposts = action.payload;
        },
        removealluserspost: (state) => {
            state.allusersposts = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchuserposts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchuserposts.fulfilled, (state, action) => {
                state.loading = false;
                state.curruserposts = action.payload.userposts;
                state.connectionposts = action.payload.connectionpost;
                state.allusersposts = action.payload.alluserspost;
            })
            .addCase(fetchuserposts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { adduserpost, removeuserpost } = userpostSlice.actions;
export const { addconnectionpost, removeconnectionpost } = userpostSlice.actions;
export const { addalluserspost, removealluserspost } = userpostSlice.actions;
export const userpostReducer = userpostSlice.reducer;
