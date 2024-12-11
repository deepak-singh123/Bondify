import { Post } from "../models/post.js";
import { user } from "../models/user.js";
import cloudinary from 'cloudinary'

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


    export const deletepost = async (req, res) => {
        const postid = req.params.id;
        const curruser= req.user;
        try {
            const post = await Post.findById(postid);
            
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            const cuser = await user.findById(post.author_id);
      
            if(curruser._id.toString() === cuser._id.toString()){
                await cloudinary.v2.api
                    .delete_resources([`${post.postname}`], 
                        { type: 'upload', resource_type: 'image' });

                await post.deleteOne();
                
                return res.status(200).json({ message: "Post deleted successfully" });
          
        }
     } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
    };