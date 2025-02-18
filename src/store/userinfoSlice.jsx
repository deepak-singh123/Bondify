import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export   const handleResultClick = async (user,dispatch,navigate) => {
    try {
        await dispatch(fetchuserinfo(user._id)).unwrap();
        const response = await fetch(`/user/views/${user._id}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok)throw new Error("Failed to fetch user info");   
        navigate(`/Profileinfo/${user._id}`);
    } catch (err) {
        console.error("Error fetching user info:", err);
    }
};


export const fetchuserinfo  = createAsyncThunk(
    'userinfo/fetchuserinfo',
    async (id) => {
        try {
            const response = await fetch(`https://bondify-1lzw.onrender.com/user/${id}/info`, {
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