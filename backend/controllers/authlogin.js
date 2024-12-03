import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { user } from "../models/user.js";
import express from "express"
import cookieParser from "cookie-parser";
const app =  express();
app.use(express.json())
dotenv.config()
app.use(cookieParser());
export const userlogin = async (req,res)=>{
    const {email,password} = req.body;
    const founduser = await user.findOne({email});

    if(!founduser){
       return  res.status(404).json({messege:"No such User"});

    }else{
        try{
            const ismatch = await bcrypt.compare(password,founduser.password);
            if(!ismatch){
              return   res.status(401).json({messege:"Invalid Credentials"})
            }
            if (!process.env.SECRET_KEY) {
                console.error("SECRET_KEY is not defined in the environment variables.");
                process.exit(1); 
            }
                const payload = { _id: founduser._id, email: founduser.email };

                const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"10h"});
            
            res.cookie("authToken",token,{
                httpOnly:true,
                maxAge: 3600000*5, 
            })
         return   res.status(200).json({ message: "Login successful" });

            
        }
        catch(e){
            console.log("error:" , e);
            res.status(500).json({ message: "An error occurred on the server." });
        }
    }
}