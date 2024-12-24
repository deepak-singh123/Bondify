import { createSlice } from "@reduxjs/toolkit";






const postlikeSlice = createSlice({
    name: 'postlike',
    initialState:{
        ispostlike:false
    },
    reducers: {
        setPostLike: (state) => {
            state.ispostlike = !state.ispostlike;
        }
    }
})

export const { setPostLike } = postlikeSlice.actions;
export default postlikeSlice.reducer;