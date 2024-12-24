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
import postlikeReducer from "./postlikeSlice";
import commentReducer from "./commentSlice";
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
        messagecount: messagecountReducer,
        postlike:postlikeReducer,
        comment:commentReducer
    },  
});
