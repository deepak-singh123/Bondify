import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import pathReducer from "./pathSlice";
import themeReducer from "./themeSlice";
import userpostReducer from "./postSlice";
import followersinfoReducer from "./followersSlice"; 
import followinginfoReducer from "./followingSlice"; 
import searchReducer from "./searchSlice";
import userinfoReducer from "./userinfoSlice";
import isFollowingReducer from "./isFollowingSlice";
import alluserReducer from "./alluserSlice";
import messagesReducer from "./messagesSlice";
import messagecountReducer from "./messagecount";
export const store = configureStore({
    reducer: {
        user: userReducer,
        path: pathReducer,
        theme: themeReducer,
        userposts: userpostReducer,
        followinginfo: followinginfoReducer,
        followersinfo: followersinfoReducer,
        search: searchReducer,
        userinfo: userinfoReducer,
        isFollowing: isFollowingReducer,
        alluser: alluserReducer,
        messages: messagesReducer,
        messagecount: messagecountReducer    }
});
