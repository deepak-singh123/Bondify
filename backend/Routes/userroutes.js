import express from "express" 
import { isauthenticated } from "../middlware/isAuthenticated.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import { user } from "../models/user.js"

import allusers from "../controllers/allusers.js";

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
dotenv.config()
app.use(cors()); 
const userroutes =  express.Router();

userroutes.get("/allusers",isauthenticated,allusers);
export default userroutes