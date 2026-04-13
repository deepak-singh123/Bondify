import { Post } from "../models/post.js";
import { user } from "../models/user.js";

export const userviews = async (req, res) => {
    const personid = req.params.id;
    try {
      const person = await user.findById(personid);
  
      if (!person) {
        return res.status(404).json({ message: "User not found" });
      }
      if(person.views.includes(req.user._id)){
        return res.status(200).json({ message: "You have already viewed this user" });
      }
      person.views.push(req.user._id);
      await person.save();
  
      res.status(200).json({ message: "User views updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }

}
const userdata= async (req,res)=>{
    const personid = req.params.id;
    try{
    const person = await user.findById(personid).select('-email -password');
    if (!person) {
        return res.status(404).json({ message: "User not found" });
    }
    const personposts = await Post.find({ author_id: person._id }).sort({ createdAt: -1 }).populate('author_id', 'username profilePicture views');;
    
    res.status(200).json({person,personposts});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }

}


export default userdata