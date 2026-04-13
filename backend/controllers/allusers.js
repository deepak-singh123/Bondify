import { user } from "../models/user.js";

const allusers = async (req, res) => {
   const curruser = req.user;
  try {
    const users = await user.find({ _id: { $ne: curruser._id }, role: "user" }).select("-email -password");
    res.json(users);
  } catch (err) {
    console.log(err);  
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

export default allusers;
