import express from "express" 
import { isauthenticated } from "../middlware/isAuthenticated.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import { getMessages, markasread, sendmessage, uploadchatimage } from "../controllers/messages.js";
import upload from "../middlware/multer.js";


const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
dotenv.config()
app.use(cors()); 
const messageroutes =  express.Router();

messageroutes.post("/send/:id",isauthenticated,sendmessage);
messageroutes.get("/getmessages/:id",isauthenticated,getMessages);
messageroutes.post("/uploadchatimage",upload.single('chatimage'),isauthenticated,uploadchatimage);
messageroutes.post("/markasread",isauthenticated,markasread);

export default messageroutes