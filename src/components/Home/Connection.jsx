import { setIsFollowing } from "../../store/isFollowingSlice";
import { useDispatch, useSelector } from "react-redux"
import { handlefollow } from "../../store/followersSlice";
import { useEffect, useState } from "react";
import { fetchuserinfo } from "../../store/userinfoSlice";
import { useNavigate } from "react-router-dom";




const Connection = ({follower,following})=>{

    const [isFollowing, setIsFollowing] = useState("Follow");
    const curruser = useSelector((store) => store.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (following && follower._id) {
            const isUserFollowing = following.some(user => user._id === follower._id);
            setIsFollowing(isUserFollowing ? "Following" : "Follow");
        }
    }, [following, follower._id]  );

    const handleResultClick = async (user) => {
        
        try {
           await dispatch(fetchuserinfo(user._id)).unwrap();
            const response = await fetch(`/user/views/${user._id}`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok)throw new Error("Failed to fetch user info");   
            navigate(`/Profileinfo/${user._id}`);
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    };

    const handleFollowClick = () => {
        handlefollow(follower._id, following, dispatch);
        setIsFollowing(prev => (prev === "Follow" ? "Following" : "Follow"));
    };

    return(
        <>
           <div  className="follower-card">
                   <div onClick={() => handleResultClick(follower)} className="follower-info"> 
                    <img src={follower.profilePicture} alt={follower.username}  />
                    <h2 className="username">{follower.username}</h2>
                    </div>
                    <button
                        onClick={handleFollowClick}
                        className='follow-button'>
                        {isFollowing}
                    </button>
                    </div>
        </>
    )
} 

export default Connection