import { createSlice } from "@reduxjs/toolkit";










const isFollowingSlice = createSlice({
    name: 'isFollowing',
    initialState: {
        isFollowing: "",
    },
    reducers: {
        setIsFollowing: (state, action) => {
            state.isFollowing = action.payload;
        },
    },
});

export const { setIsFollowing } = isFollowingSlice.actions;
export default isFollowingSlice.reducer;
   