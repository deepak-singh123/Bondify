import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchAllUser = createAsyncThunk(
    'alluser/fetchAllUser',
    async () => {
      const response = await fetch("https://bondify-1lzw.onrender.com/user/allusers", {
        method: "GET",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error("Failed to fetch user info");
      return response.json();
    }
  );
  


const alluserSlice = createSlice({
    name: 'alluser',
    initialState: {
        alluser: [],
    },
    reducers: {
        setAllUser: (state, action) => {
            state.alluser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllUser.fulfilled, (state, action) => {
          state.alluser = action.payload;
        });
      },
      
});

export const { setAllUser } = alluserSlice.actions;
export default alluserSlice.reducer;