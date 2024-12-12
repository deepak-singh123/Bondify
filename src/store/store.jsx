import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import pathReducer from "./pathSlice";
import themeReducer from "./themeSlice";
import { userpostReducer } from "./postSlice";
import followersinfoReducer from "./followersSlice"; 
import followinginfoReducer from "./followingSlice"; 
import searchReducer from "./searchSlice";
import userinfoReducer from "./userinfoSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        path: pathReducer,
        theme: themeReducer,
        userposts:userpostReducer,
        followinginfo: followinginfoReducer,
        followersinfo: followersinfoReducer,
        search: searchReducer,
        userinfo:userinfoReducer
       
    }
}); 
