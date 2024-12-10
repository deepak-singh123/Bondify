import { Post } from "../models/post.js";

export const allposts = async (req, res) => {
        const curruser =  req.user;
        if(!curruser){
            return res.status(404).json({message:"User not exist"});
        }
        const connections = [...curruser.followers, ...curruser.following, curruser._id];
        const userConnections = [...curruser.followers, ...curruser.following];
        try{
            const userposts = await Post.find({ author_id: curruser._id })
                .sort({ createdAt: -1 })
                .populate('author_id', 'username profilePicture');
            const connectionpost = await Post.find({ author_id: { $in: userConnections } })
                .sort({ createdAt: -1 })
                .populate('author_id', 'username profilePicture');
            const alluserspost = await Post.find({ author_id: { $nin: connections } })
                .sort({ createdAt: -1 })
                .populate('author_id', 'username profilePicture');
            res.status(200).json({userposts, connectionpost, alluserspost});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message:"Internal Server Error"});
        }
    };