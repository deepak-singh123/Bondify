import bcrypt from "bcrypt";

import { user } from "../models/user.js";



 export const registeruser =  async (req, res) => {
    const {username,email,password} = req.body;
   
    const curruser = await user.findOne({email});
    
    
    if(!curruser){
        
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password,salt);
      await user.create({username:username,email:email,password:hashedpassword});
      res.send("User created successfully!");
    }catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json("Failed to create user.");
    }
  }
else{
    res.send("User already exist");
}}
