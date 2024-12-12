import express from "express" 
import { isauthenticated } from "../middlware/isAuthenticated.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import searchuser from "../controllers/searchcontroller.js";

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
dotenv.config()
app.use(cors()); 
const searchroutes =  express.Router();

searchroutes.get("/search",isauthenticated,searchuser);

export default searchroutes