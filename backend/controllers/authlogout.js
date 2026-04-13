import dotenv from "dotenv"
import { user } from "../models/user.js";
import express from "express"
import cookieParser from "cookie-parser";
const app =  express();
app.use(express.json())
dotenv.config()
app.use(cookieParser());


export const authlogout = (req, res) => {
    try {
      

        res.clearCookie("authToken", { httpOnly: true, secure: true });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in authlogout:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
