import { useSelector } from "react-redux"
import { handlefollow } from "../../store/followersSlice";
import Connection from "./Connection";
import { useEffect, useState } from "react";







const Connectionslists =  () => {
    const followers = useSelector((store)=>store.followersinfo.followers);
    const following = useSelector((store)=>store.followinginfo.following);



   const connectionlist = [
    ...followers.filter((follower) => !following.some((follow) => follow.id === follower.id)),
    ...following,
  ];
   const curruser = useSelector((store) => store.user.user);

   

  const generateSuggestions = () => {
 
  
    const connectionIds = connectionlist.map((connection) => connection._id);
  
    // Fetch all users from the store
    const allUsers = useSelector((store) => store.alluser.alluser); // [{ id, followers, following, ... }]
  
    // Filter users for mutual connections and non-connections
    const suggestions = allUsers.filter((user) => {
      // Skip if the user is already in `connectionlist`
      if (connectionIds.includes(user._id)) return false;
  
      // Check for mutual followers or following
      const mutualFollowers = user.followers.some((followerId) => connectionIds.includes(followerId));
      const mutualFollowing = user.following.some((followingId) => connectionIds.includes(followingId));
  
      // Include users with mutual connections
      return mutualFollowers || mutualFollowing;
    });
  
    // Add remaining users (who are not in `connectionlist` and don't have mutuals)
    const nonMutuals = allUsers.filter(
      (user) =>
        !connectionIds.includes(user._id) && // Exclude already connected users
        !suggestions.some((suggestion) => suggestion._id === user._id) // Exclude mutuals
    );
  
    const finalSuggestions = [...suggestions, ...nonMutuals];
  
    return finalSuggestions;
  };
  
   const suggestions=  generateSuggestions();


    return (
       <>
       <div className="connectionslists-container">
       <div className="connectionslists">
        
        {suggestions.length>0 && <div className="suggestions-lists">
            <div className="connection-title"><h2>  Suggestions</h2></div> 
            <br/>
            {suggestions.map((follower)=>{
                return(
                    <Connection key={follower._id} follower={follower}  following={following} />
                )
            })}
            </div>}
        {connectionlist.length>0 && <div className="followers-list"> 
            <div className="connection-title"><h2>{curruser.username}'s Connections</h2></div>
            <br/>
            {connectionlist.map((follower)=>{
                return(
                    <Connection  key={follower._id} follower={follower}  following={following} />
                )
            })}
            </div>}
            
    
           

            </div>
        
    



       
       </div>
        
       
       </>
    )
}


export default Connectionslists