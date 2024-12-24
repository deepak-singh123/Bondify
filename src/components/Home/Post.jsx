import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { fetchfollowinginfo } from '../../store/followingSlice';
import { handlefollow } from '../../store/followersSlice';
import { handleResultClick } from '../../store/userinfoSlice';
import { useNavigate } from 'react-router-dom';
import { setPostLike } from '../../store/postlikeSlice';
import { Comment } from './comment/comment';
import { fetchcomments } from '../../store/commentSlice';

const Post = ({ post }) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [isFollowing, setIsFollowing] = React.useState("Follow");
    const curruser = useSelector((store) => store.user.user);
    const dispatch = useDispatch();
    const following = useSelector((store) => store.followinginfo.following);
    const navigate = useNavigate();
    const ispostliked =useSelector((store) => store.postlike.ispostliked);
    const [count,setcount] = useState(0);
    const [checkcomments, setcheckcomments] = useState(false);
    const handlemenu = () => setShowMenu(!showMenu);

    // Update `isFollowing` when `following` or `post.author_id._id` changes
    useEffect(() => {
        if (following && post.author_id && post.author_id._id) {
            const isUserFollowing = following.some(user => user._id === post.author_id._id);
            setIsFollowing(isUserFollowing ? "Following" : "Follow");
        }
    }, [following, post.author_id]);

    useEffect(() => {
        if(post.likes.includes(curruser._id)){
            setcount(1);
        }
        else{
            setcount(0);
        }
    },[post]);

    useEffect(()=>{
        if(checkcomments){
            dispatch(fetchcomments(post._id));
        }
    },[checkcomments,dispatch]);



    // Handle follow/unfollow logic
    const handleFollowClick = () => {
        handlefollow(post.author_id._id, following, dispatch);
        // Optimistically update the UI
        setIsFollowing(prev => (prev === "Follow" ? "Following" : "Follow"));
    };

    const handledelete = async (postid) => {
        try {
            const response = await fetch(`http://localhost:3000/user/post/delete/${postid}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error("Failed to delete post");
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlepostlike = async (postid) => {
        try {
            const response = await fetch(`http://localhost:3000/user/post/likepost/${postid}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok){
                const data = await response.json();
                if(data.status === 'liked'){
                   setcount(1);
                }else if(data.status === 'unliked'){
                    setcount(0);
                }
                dispatch(setPostLike())
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="post">
            <div className="post-header-container">
                <div onClick={()=>handleResultClick(post.author_id,dispatch,navigate)} className="post-header">
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
                {curruser._id === post.author_id._id ? (
                    <div className="post-menu-container">
                        <div className='post-menu'>
                            <button
                                onClick={() => handledelete(post._id)}
                                className={`post-menu-option ${showMenu ? 'active' : ''}`}>
                                <MdDelete />
                                Delete Post
                            </button>
                        </div>
                        <button onClick={handlemenu} className="post-menu-button">
                            <CiMenuKebab />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleFollowClick}
                        className='follow-button'>
                        {isFollowing}
                    </button>
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
                <button className="post-action-button" onClick={() => handlepostlike(post._id)}>
                    <i className={`far fa-heart ${count ? 'liked' : ''}`} ></i>
                    <span className="post-action-count">{post.likes?.length+count|| 0}</span>
                </button>
                <button className="post-action-button" onClick={() => setcheckcomments(!checkcomments)}>
                    <i className="far fa-comment"></i>
                    <span className="post-action-count">{post.comments?.length || 0}</span>
                </button>
            </div>

            {checkcomments && <Comment post={post} />}
        </div>
    );
};

export default Post;
