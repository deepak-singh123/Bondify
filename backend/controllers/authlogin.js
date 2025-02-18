import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { user } from "../models/user.js";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(cookieParser());

export const userlogin = async (req, res) => {
    const { email, password } = req.body;

    const founduser = await user.findOne({ email });
    
    if (!founduser) {
        return res.status(404).json({ message: "No such User" });
    }

    try {
        const ismatch = await bcrypt.compare(password, founduser.password);
        if (!ismatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ message: "Server configuration error: SECRET_KEY is not defined." });
        }

        const payload = { _id: founduser._id, email: founduser.email };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "10h" });
console.log("process.env.NODE_ENV= ",process.env.NODE_ENV);
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3600000 * 5, // 5 hours
            secure: process.env.NODE_ENV === "production", // 🔹 Ensure secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
           
        });
      

      res.status(200).json({
  message: "Logged in successfully",
  redirectTo: founduser.profilePicture !== "" ? "/home" : "/profileupload"
});
        
}

    catch (e) {
        console.log("Error:", e);
        res.status(500).json({ message: "An error occurred on the server." });
    }
};
