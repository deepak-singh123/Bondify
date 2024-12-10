import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchuserposts } from "../../store/postSlice";
import { current } from "@reduxjs/toolkit";
import Post from "./Post";


const Postlist = () => {

    const dispatch = useDispatch();
    const {curruserposts, connectionposts, allusersposts} = useSelector((store)=>store.userposts);
    const { loading, error } = useSelector((store) => store.userposts);

   
   
    const postslist = [...curruserposts, ...connectionposts, ...allusersposts];
    console.log('Posts data:', postslist);
    return (
        <div className="postlist-container">
            
            {postslist.map((post)=>{
                return(
                    <Post key={post._id} post={post}/>
                )
            })}
           
            </div>
    )
}
export default Postlist