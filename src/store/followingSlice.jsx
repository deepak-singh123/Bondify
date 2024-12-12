import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    following: [],
    loading: false,
    error: null
};

export const fetchfollowinginfo = createAsyncThunk(
    'followinginfo/fetchfollowinginfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/user/connections/following", {
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

const followinginfoSlice = createSlice({        
    name: 'followinginfo',
    initialState,
    reducers: {
        setFollowing: (state, action) => {
            state.following = action.payload;
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
            .addCase(fetchfollowinginfo.pending, (state) => {
                state.loading = true;    
                state.error = null;
            })
            .addCase(fetchfollowinginfo.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload.following;
            })
            .addCase(fetchfollowinginfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { setFollowing, setLoading, setError } = followinginfoSlice.actions;
export default followinginfoSlice.reducer;