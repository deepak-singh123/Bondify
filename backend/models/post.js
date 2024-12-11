import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    postname:{
        type: String,
        default: ""
    },
    content: {
        type: String,
        required: true,
        maxLength: 500
    },
    postimage: {
        type: String,  // URL to image/video
        default: ""
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        text: {
            type: String,
            required: true,
            maxLength: 200
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String
    }],
    visibility: {
        type: String,
        enum: ["public", "private", "followers"],
        default: "public"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Update the updatedAt timestamp before saving
postSchema.pre("save", function(next) {
    this.updatedAt = new Date();
    next();
});

export const Post = mongoose.model("post", postSchema);