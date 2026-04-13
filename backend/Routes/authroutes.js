import express from "express";
import { registeruser } from "../controllers/authregister.js";
import { userlogin } from "../controllers/authlogin.js";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import { authlogout } from "../controllers/authlogout.js";
import uploadprofile from "../controllers/uploadprofile.js";
import upload from "../middlware/multer.js";
import isLoggedin from "../controllers/isLoggedin.js";

const authroutes = express.Router();
authroutes.post("/register", registeruser);
authroutes.post("/login", userlogin);
authroutes.post("/logout", isauthenticated, authlogout);
authroutes.post("/isloggedin", isauthenticated, isLoggedin);
authroutes.post("/api/user/profile", upload.single('profilePhoto'), isauthenticated, uploadprofile);
export default authroutes;
