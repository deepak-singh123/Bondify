import express from "express" 
import { registeruser } from "../controllers/authregister.js";
import { userlogin } from "../controllers/authlogin.js";
import { isauthenticated } from "../middlware/isAuthenticated.js";
import { authlogout } from "../controllers/authlogout.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import uploadprofile from "../controllers/uploadprofile.js";
import multer from "multer";
import upload from "../middlware/multer.js";
import isLoggedin from "../controllers/isLoggedin.js";

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

dotenv.config()

app.use(cors()); 

const authroutes =  express.Router();
authroutes.post("/register",registeruser);
authroutes.post("/login",userlogin);
authroutes.post("/logout",isauthenticated,authlogout);
authroutes.post("/isloggedin",isauthenticated,isLoggedin);
authroutes.post("/api/user/profile",upload.single('profilePhoto'),isauthenticated,uploadprofile);
export default authroutes;