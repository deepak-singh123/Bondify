import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserinfo } from "../../store/userinfoSlice";
import { FaEye } from "react-icons/fa";

const Usercard = () => {
  const curruser = useSelector((store) => store.user.user); // Current user
  const dispatch = useDispatch();

  // Fetch user info when component mounts
  useEffect(() => {
    if (curruser && curruser._id) {
      dispatch(fetchuserinfo(curruser._id))
        .unwrap()
        .catch((err) => console.error("Error fetching user info:", err));
    }
  }, [curruser, dispatch]);

  const userinfo = useSelector((store) => store.userinfo.user);

  if (!userinfo || Object.keys(userinfo).length === 0) {
    return <div>Loading user info...</div>;
  }

  const person = userinfo.person;
  const personposts = userinfo.personposts || [];

  return (
    <div className="userinfo-card mainuser">
    <img src={person.profilePicture} alt={person.username} className="profile-picture" />
    <h2 className="username">{person.username}</h2>
    <div className="userinfo-bio">"{person.bio}"</div>
   <div className="profile-views">
        <span className="views-count"> <FaEye />Viewed By: {person.views.length} Person </span>
    </div>    
    <div className="user-stats">
        <div className="stat">
            <span className="stat-count">{person.followers.length}</span>
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


  );
};

export default Usercard;
