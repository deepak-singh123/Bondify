import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    followers: [],
    loading: false,
    error: null
};

 export   const fetchfollowersinfo = createAsyncThunk(
    'followinfo/fetchfollowersinfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/user/followers", {
                method: "GET",
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });

            if (!response.ok) {
                return rejectWithValue('Failed to fetch follow info');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
                
                
    )

const followersinfoSlice = createSlice({        
    name: 'followersinfo',
    initialState,
    reducers: {
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
    ,
    extraReducers: (builder) => {
        builder
            .addCase(fetchfollowersinfo.pending, (state) => {
                state.loading = true;    
                state.error = null;
            })
            .addCase(fetchfollowersinfo.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload.followers;
            })
            .addCase(fetchfollowersinfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { setFollowers, setLoading, setError } = followersinfoSlice.actions;
export default followersinfoSlice.reducer;