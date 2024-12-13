import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handlefollow } from "../../store/followersSlice";



const  Userinfo = ()=>{
    
    const userinfo = useSelector((store)=>store.userinfo.user);
    const person =userinfo.person;
    const dispatch = useDispatch();
    const personposts = userinfo.personposts;
    const [isFollowing, setIsFollowing] = useState("Follow");
    const following = useSelector((store) => store.followinginfo.following);
    const [followerscount,setfollowerscount]= useState(person.followers.length);

    useEffect(() => {
        if (following && person._id) {
            const isUserFollowing = following.some(user => user._id === person._id);
            setIsFollowing(isUserFollowing ? "Following" : "Follow");
        }
    }, [following, person._id]  );
    const handleFollowClick = () => {
        handlefollow(person._id, following, dispatch);
        setIsFollowing(prev => (prev === "Follow" ? "Following" : "Follow"));
        setfollowerscount(prevcount => prevcount + (isFollowing === "Follow" ? 1 : -1));
    };


    return(
        <>
           <div className="userinfo-card">
            <img src={person.profilePicture} alt={person.username} className="profile-picture" />
            <h2 className="username">{person.username}</h2>
            <div className="userinfo-bio">"{person.bio}"</div>
            <div className="Profile-buttons">
                <button onClick={handleFollowClick} className="follow-button">{isFollowing}</button>
                <button className="message-button">Message</button>
            </div>
            <div className="user-stats">
                <div className="stat">
                    <span className="stat-count">{followerscount}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{person.following.length}</span>
                    <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{personposts.length}</span>
                    <span className="stat-label">Posts</span>
                </div>
            </div>
          
        </div>

        
        
        </>
    )
}

export default Userinfo