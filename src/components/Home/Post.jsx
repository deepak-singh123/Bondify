import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { se } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { use } from 'react';
import { fetchfollowinginfo } from '../../store/followingSlice';

const Post = ({ post,curruser }) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const dispatch = useDispatch();
    const  followers = useSelector((store) => store.followersinfo); 
    const following = useSelector((store) => store.followinginfo.following);
    const [isFollowing, setIsFollowing] = useState("Follow");
    const handlemenu = () => {
        if(!showMenu)setShowMenu(!showMenu);
        else{
            setShowMenu(!showMenu);
        }
      };

      const handlefollow=async(followid)=>{
        try {
           
            const _id=followid.toString();
            if( following.some(user => user._id === _id)){
              
                const response =  await fetch(`http://localhost:3000/user/connections/${followid}/unfollow`,{
                    method:"POST",
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                });
                setIsFollowing("Follow");
                if(!response.ok)throw new Error("Failed to unfollow");
                const data = await response.json();
                console.log(data);
                dispatch(fetchfollowinginfo());
                
            }
            else{
                const response =  await fetch(`http://localhost:3000/user/connections/${followid}/follow`,{
                    method:"POST",
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                });
                setIsFollowing("Following");
                if(!response.ok)throw new Error("Failed to follow");
                const data = await response.json();
                console.log(data);
                dispatch(fetchfollowinginfo());
               
            }
                
            }
            catch (error) {
                console.log(error);
            }
        }

        useEffect(() => {

            if(following.some(user => user._id === post.author_id._id)){
                setIsFollowing("Following");
              }
              else{
                setIsFollowing("Follow");
              }
            },[handlefollow,following]);
          





    const handledelete=async(postid)=>{
        try {
            const response = await fetch(`http://localhost:3000/user/post/delete/${postid}`, {
                method:"POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok)throw new Error("Failed to delete post");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div className="post">
            <div className="post-header-container">
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
            { curruser._id === post.author_id._id ? (
              <div className="post-menu-container">
                <div className='post-menu'>
                    <button onClick={()=>handledelete(post._id)} className={`post-menu-option ${showMenu ? 'active' : ''}`}><MdDelete />
                    Delete Post</button>
                   
                </div> 
                <button onClick={() =>handlemenu()} className="post-menu-button ">
                    <CiMenuKebab />
                </button>
                </div> 
            ):(
                <button onClick={()=>handlefollow(post.author_id._id)} className='follow-button'>{isFollowing}</button>
            )}
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