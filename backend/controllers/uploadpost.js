import cloudinary from 'cloudinary'
import fs from 'fs/promises';
import { Post } from '../models/post.js';

const uploadpost = async (req, res) => {
    try {
        let postData = {
            author_id: req.user._id,
            content: req.body.content || ''
        };

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'Bondify/Posts',
                resource_type: 'image',
                access_mode: 'public',
                public_id: `post-${Date.now()}`,
                overwrite: true
            });

            postData.postimage = result.secure_url;
            postData.postname = result.public_id;


            await fs.unlink(req.file.path).catch((err) =>
                console.error('Failed to delete file:', err)
            );
        }

        const newpost = new Post(postData);
        await newpost.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: newpost
        });
    } catch (error) {
        console.error('Error in uploadpost:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post',
            error: error.message
        });
    }
};

export default uploadpost;