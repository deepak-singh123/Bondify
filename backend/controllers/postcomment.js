
import { Post } from "../models/post.js";

export const postcomment  =async(req,res)=>{
    console.log("inside postcomment");

    const curruser = req.user;
    const postid = req.params.id;
    const comment = req.body.content;
    console.log(comment);
    try{
        const post = await Post.findById(postid);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        post.comments.push({
            user:curruser,
            text:comment,
            createdAt:Date.now()
        });
        await post.save();
        res.status(200).json({message:"Comment added"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getcomments = async(req,res)=>{

    const postid = req.params.id;
    const curruser = req.user;

    try{
        const post = await Post.findById(postid).populate({
            path: 'comments.user',
            select: 'username profilePicture',
        });

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        res.status(200).json(post.comments);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}