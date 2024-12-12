import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchuserposts } from "../../store/postSlice";
import { current } from "@reduxjs/toolkit";
import Post from "./Post";
import { fetchfollowersinfo } from "../../store/followersSlice";


const Postlist = () => {
    const dispatch = useDispatch();
    
    const {curruserposts, connectionposts, allusersposts} = useSelector((store)=>store.userposts);
    const curruser = useSelector((store)=>store.user.user);
    const { loading, error } = useSelector((store) => store.userposts);
    const relatedposts = [...curruserposts,...connectionposts];
    relatedposts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
   
   
   
    const postslist = [...relatedposts, ...allusersposts];
    return (
        <div className="postlist-container">
            
            {postslist.map((post)=>{
                return(
                    <Post key={post._id} post={post} curruser={curruser}/>
                )
            })}
           
            </div>
    )
}
export default Postlist