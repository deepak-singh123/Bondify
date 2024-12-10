import { user } from "../models/user.js";

const allusers = async (req, res) => {
  try {
    const users = await user.find({ role: "user" }).select("-email -password");
    res.json(users);
  } catch (err) {
    console.log(err);  
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

export default allusers;
