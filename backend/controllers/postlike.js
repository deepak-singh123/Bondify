import { Post } from "../models/post.js";


export const likepost = async (req, res) => {
    console.log("insidepostlike");
    const curruser = req.user;
       let status ="unliked";
    try {
        
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(curruser._id)) {
            post.likes.pull(curruser._id);
            status = "unliked";
        } else {
            post.likes.push(curruser._id);
            status = "liked";
        }

        await post.save();
        return res.status(200).json({message:"Post liked/unliked successfully",status})
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};