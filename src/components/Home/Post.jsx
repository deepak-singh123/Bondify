import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post }) => {
    return (
        <div className="post">
            <div className="post-header">
                <img 
                    src={post.author_id.profilePicture || '/default-avatar.png'} 
                    alt={post.author_id.username} 
                    className="post-user-avatar"
                />
                <div className="post-user-info">
                    <h4 className="post-username">{post.author_id.username}</h4>
                    <p className="post-timestamp">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>

            <p className="post-content">{post.content}</p>
            
            {post.postimage && (
                <img 
                    src={post.postimage} 
                    alt="Post content" 
                    className="post-image"
                />
            )}

            <div className="post-actions">
                <button className="post-action-button">
                    <i className="far fa-heart"></i>
                    <span className="post-action-count">{post.likes?.length || 0}</span>
                </button>
                <button className="post-action-button">
                    <i className="far fa-comment"></i>
                    <span className="post-action-count">{post.comments?.length || 0}</span>
                </button>
            </div>
        </div>
    );
};

export default Post;