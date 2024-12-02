import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/authroutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth',router);
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

mongoose.connect( MONGO_URL,{
    dbName:"Bondify",
}).then((console.log("Database connected")
)).catch(e=>console.log(e)
)


app.get('/',(req,res)=>{
    res.send("Home page");
})


app.listen(PORT,()=>{
    console.log(`Server is active on port ${PORT}`);
    
})
