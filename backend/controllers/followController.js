import { user } from "../models/user.js";

export const followUser =  async (req,res)=>{


   const curruser = req.user;
   const followuser = await user.findById(req.params.id);
   if(!followuser){
       return res.status(404).json({ message: "User not exist to follow" });
   }

   if(curruser.following.includes(followuser._id)){
    res.status(400).json({message:"You are already following this user"});
   }
   else{
    curruser.following.push(followuser._id);
    followuser.followers.push(curruser._id)
    await curruser.save();
    await followuser.save();
    res.status(200).json({message:"User followed successfully"});
   }

}

export const unfollowUser = async(req,res)=>{
    const curruser = req.user;
    const unfollowuser = await user.findById(req.params.id);
    
    if(!unfollowuser){
        return res.status(404).json({message:"User not exist to unfollow"})
    }

    else if(curruser.following.includes(unfollowuser._id)){
        curruser.following.pull(unfollowuser._id)// removing the id of user from curruser following
        unfollowuser.followers.pull(curruser._id) // removing the id of curruser from unfollowuser followers
        await curruser.save();
        await unfollowuser.save();
        res.status(200).json({message:"User unfollowed successfully"});
    }
}

export const getFollowers = async (req, res) => {
    try {
      const curruser = req.user; 
  
      if (curruser) {
        const populatedUser = await user.findById(curruser._id).populate("followers", "username email profilePicture bio");
       
        if (populatedUser) {
          res.status(200).json(populatedUser.followers);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.status(404).json({ message: "User not authenticated" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
export const getFollowing = async (req,res)=>{
    const curruser = req.user;
    if(curruser){
        const following = await user.findById(curruser._id).populate('following'," username profilePicture");

        if(following){
            res.status(200).json(following);
        }
    }
    else{
        res.status(404).json({message:"User not exist"});
    }

}