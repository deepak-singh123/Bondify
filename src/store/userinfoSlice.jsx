import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchuserinfo  = createAsyncThunk(
    'userinfo/fetchuserinfo',
    async (id) => {
        try {
            const response = await fetch(`/user/${id}/info`, {
                method: "GET",
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            if(!response.ok)throw new Error("Failed to fetch user info");
            return response.json();
        }
        catch(err){
            console.log(err);
        }
    }
)

const userinfoSlice = createSlice({
    name: 'userinfo',
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchuserinfo.pending, (state) => {
            state.user = {};
        })
        .addCase(fetchuserinfo.rejected, (state) => {
            state.user = {};
        })
            .addCase(fetchuserinfo.fulfilled, (state, action) => {
                state.user = action.payload;
            })
    }
});

export const {setUser} = userinfoSlice.actions;
export default userinfoSlice.reducer;