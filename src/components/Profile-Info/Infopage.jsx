import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Home/Nav";
import Userinfo from "./Userinfo";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchuserinfo } from "../../store/userinfoSlice";
import Post from "../Home/Post";
import { BsPostcard } from "react-icons/bs";
import Postsinfo from "./postsinfo";
import Postcard from "./postcard";

const Infopage = () => {
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const userinfo = useSelector((store) => store.userinfo.user);
    const currser = useSelector((store) => store.user.user);
    
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    const [personpost, setpersonpost] = useState({});
    const [person, setperson] = useState({});
    const curruser = useSelector((store) => store.user.user);
    const [isactive,setisactive]= useState(false);
    const [infobackground,setinfobackground]= useState(" ");
    const postdetailRef = useRef(null);
    const getpersondetail = (personpost, person) => {
   
            setpersonpost(personpost);
            setperson(person);
            setisactive(true);
            setinfobackground("active");
       
    };
    
    
    useEffect(() => {
        const handlepostinfoutside = (event) => {
            if (
                postdetailRef.current &&
                !postdetailRef.current.contains(event.target)
            ) {
               setisactive(false);
               setinfobackground(" ");
            }
        };
        document.addEventListener('mousedown', handlepostinfoutside);
        return () => {
            document.removeEventListener('mousedown', handlepostinfoutside);
        };
    }, []);

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
        <div className={`infopage `}>
            <Navbar />
            <div className={`infopage-content ${infobackground}`}>
                
            
           <div className={`userinfo ${infobackground}`}> <Userinfo  userinfo={userinfo} /></div>

            <div  ref={postdetailRef} className={`postdetail ${infobackground}`}>        
    {!isEmpty(personpost) && isactive ? (
       <Postcard post={personpost} curruser={curruser} />
    ) : null}
</div>

           <div className={`postsinfo ${infobackground}`} ><Postsinfo userinfo={userinfo} getpersondetail={getpersondetail} /></div>
            </div>
        </div>
    );
};

export default Infopage;
