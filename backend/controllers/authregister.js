import bcrypt from "bcrypt";

import { user } from "../models/user.js";
import { redirect } from "react-router-dom";

 export const registeruser =  async (req, res) => {
    const {username,email,password} = req.body;
   
   
    const curruser = await user.findOne({email});
    
    
    if(!curruser){
        
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password,salt);
      await user.create({username:username,email:email,password:hashedpassword});
      res.status(200).json({message:"registered successfully"})
    }catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json("Failed to create user.");
    }
  }
else{
    res.status(404).json({message:"User already exist"});
}}
