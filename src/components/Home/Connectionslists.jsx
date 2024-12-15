import { useSelector } from "react-redux"
import { handlefollow } from "../../store/followersSlice";
import Connection from "./connection";
import { useEffect, useState } from "react";







const Connectionslists =  () => {
    const followers = useSelector((store)=>store.followersinfo.followers);
    const following = useSelector((store)=>store.followinginfo.following);


   const connectionlist = [...followers,...following];


   

    return (
       <>
       <div className="connectionslists">
        <h2>Your Connections</h2>
        {connectionlist.length>0 && <div className="followers-list"> 
            {connectionlist.map((follower)=>{
                return(
                    <Connection follower={follower}  following={following} />
                )
            })}
            </div>}
           

            
        
    



        </div>
       
        
       
       </>
    )
}


export default Connectionslists