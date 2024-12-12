import { user } from "../models/user.js";



const searchuser =  async (req, res) => {
    try{
      
        const searchQuery = req.query.q || "";
        if (searchQuery.trim() === "") {
            return res.status(200).json([]); 
    }
    const users = await user.find({
        username: { $regex: searchQuery, $options: "i" },//searches by username with query related to username in case insensitive
    }).select('_id username profilePicture'); //after filter only sending selected information

    res.status(200).json(users);
}
catch(err){
    console.log(err);
    res.status(500).json({message:"Internal Server Error"});
}
}
export default searchuser
