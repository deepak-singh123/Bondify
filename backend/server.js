import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/authroutes.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";

import authroutes from "./Routes/authroutes.js";
import userroutes from "./Routes/userroutes.js";
import postroutes from "./Routes/postroutes.js";
const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/auth',authroutes);
app.use('/user',userroutes);
app.use('/user/post',postroutes);
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

mongoose.connect( MONGO_URL,{
    dbName:"Bondify",
}).then((console.log("Database connected")
)).catch(e=>console.log(e)
)





app.listen(PORT,()=>{
    console.log(`Server is active on port ${PORT}`);
    
})
