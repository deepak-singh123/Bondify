import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Home/Nav";
import Userinfo from "./Userinfo";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchuserinfo } from "../../store/userinfoSlice";
import Postsinfo from "./postsinfo";
import Post from "../Home/Post";
import { BsPostcard } from "react-icons/bs";
import Postcard from "./postcard";

const Infopage = () => {
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const userinfo = useSelector((store) => store.userinfo.user);
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    const [personpost, setpersonpost] = useState({});
    const [person, setperson] = useState({});
    const getpersondetail = (personpost, person) => {
   
            setpersonpost(personpost);
            setperson(person);
       
    };
    
    console.log(personpost);
 

    useEffect(() => {
        if (isEmpty(userinfo)) {
           
            dispatch(fetchuserinfo(id))
                .unwrap()
                .then()
                .catch((err) => {
                    console.error("Error fetching user info:", err);
                });
        }
    }, [id, dispatch]); 



    if (isEmpty(userinfo)) {
        
        return <div>Loading user information...</div>;
    }

    return (
        <div className="infopage">
            <Navbar />
            <div className="infopage-content">
                
            
            <Userinfo userinfo={userinfo} />
            <div className="postdetail">        
    {personpost && person ? (
       <Postcard post={personpost} curruser={person} />
    ) : null}
</div>

            <Postsinfo userinfo={userinfo} getpersondetail={getpersondetail} />
            </div>
        </div>
    );
};

export default Infopage;
