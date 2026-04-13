import { Post } from "../models/post.js";
import { user } from "../models/user.js";
import cloudinary from 'cloudinary'


export const allposts = async (req, res) => {
    const curruser = req.user;
    if (!curruser) {
        return res.status(404).json({ message: "User does not exist" });
    }

    // Extract query parameters
    const lastCreatedAt = req.query.lastCreatedAt;
    const limit = parseInt(req.query.limit) || 5;

    let createdAtFilter = {}; // Initialize empty filter for createdAt

    // Validate lastCreatedAt
    if (lastCreatedAt && !isNaN(Date.parse(lastCreatedAt))) {
        createdAtFilter = { createdAt: { $lt: new Date(lastCreatedAt) } };
    }

    const connections = [...curruser.followers, ...curruser.following, curruser._id];
    const userConnections = [...curruser.followers, ...curruser.following];

    try {
        // Fetch current user's posts
        const userPostQuery = { author_id: curruser._id, ...createdAtFilter };
        const userposts = await Post.find(userPostQuery)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('author_id', 'username profilePicture');

        // Fetch connection posts
        const connectionPostQuery = { author_id: { $in: userConnections }, ...createdAtFilter };
        const connectionpost = await Post.find(connectionPostQuery)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('author_id', 'username profilePicture');

        // Fetch posts from non-connections
        const allUsersPostQuery = { author_id: { $nin: connections }, ...createdAtFilter };
        const alluserspost = await Post.find(allUsersPostQuery)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('author_id', 'username profilePicture');

        res.status(200).json({
            userposts,
            connectionpost,
            alluserspost,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};






    export const deletepost = async (req, res) => {
        console.log("inside delete");
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
