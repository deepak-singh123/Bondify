import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { fetchfollowinginfo } from "./followingSlice";
import { setIsFollowing } from "./isFollowingSlice";

const initialState = {
    followers: [],
    loading: false,
    error: null
};


export   const handlefollow=async(followid,following,dispatch)=>{
    console.log("Handlefollow called");
    try {
       
        const _id=followid.toString();
        if( following.some(user => user._id === followid)){
          
            const response =  await fetch(`https://bondify-1lzw.onrender.com/user/connections/${followid}/unfollow`,{
                method:"POST",
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            dispatch(setIsFollowing("Follow"))
            if(!response.ok)throw new Error("Failed to unfollow");
            const data = await response.json();
            console.log(data);
            dispatch(fetchfollowinginfo());
            
        }
        else{
            const response =  await fetch(`https://bondify-1lzw.onrender.com/user/connections/${followid}/follow`,{
                method:"POST",
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            dispatch(setIsFollowing("Following"));
            if(!response.ok)throw new Error("Failed to follow");
            const data = await response.json();
            console.log(data);
            dispatch(fetchfollowinginfo());
           
        } } catch (error) {
            console.log(error);
        }
    }






 export   const fetchfollowersinfo = createAsyncThunk(
    'followersinfo/fetchfollowersinfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/user/connections/followers", {
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