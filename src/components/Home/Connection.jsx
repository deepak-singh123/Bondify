import { setIsFollowing } from "../../store/isFollowingSlice";
import { useSelector } from "react-redux"
import { handlefollow } from "../../store/followersSlice";
import { useEffect, useState } from "react";




const Connection = ({follower,following})=>{

    const [isFollowing, setIsFollowing] = useState("Follow");

    useEffect(() => {
        if (following && follower._id) {
            const isUserFollowing = following.some(user => user._id === follower._id);
            setIsFollowing(isUserFollowing ? "Following" : "Follow");
        }
    }, [following, follower._id]  );


    const handleFollowClick = () => {
        handlefollow(person._id, following, dispatch);
        setIsFollowing(prev => (prev === "Follow" ? "Following" : "Follow"));
    };

    return(
        <>
           <div className="follower-card">
                   <div className="follower-info"> 
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