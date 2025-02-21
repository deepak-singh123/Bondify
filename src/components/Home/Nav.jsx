import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPeopleAlt } from "react-icons/md";
import { MdMessage } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { BsSun, BsMoonStars } from "react-icons/bs";
import "./Home.css"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { toggleTheme } from "../../store/themeSlice";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import Badge from '@mui/material/Badge';
import { socket } from "../../App";
import { fetchunreadcount } from "../../store/messagecount";




const Navbar=()=>{




    const curruser = useSelector((store)=>store.user.user)
    const isDarkMode = useSelector((store)=>store.theme.isDarkMode)
    const dispatch = useDispatch();
    const [currclass, setcurrentclass] = useState("");
    const [profilePic, setProfilePic] = useState('https://res.cloudinary.com/dchjyy4cp/image/upload/v1740149254/Bondify/Assets/default-profile_sgtmpi.jpg');
    const sidebarRef = useRef(null);
    const profileRef = useRef(null);
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const searchresultRef = useRef(null);
    const themeRef = useRef(null);
    const totalunread = useSelector((store)=>store.messagecount.totalmessagecount);
    
    useEffect(() => {
        dispatch(fetchunreadcount());


    }, [dispatch,totalunread]);




    useEffect(() => {
        const checkProfilePicture = () => {
            if (curruser?.profilePicture) {
                setProfilePic(curruser.profilePicture);
            } else if (curruser) {
                setTimeout(checkProfilePicture, 500);
            }
        };

        checkProfilePicture();
    }, [curruser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !profileRef.current.contains(event.target)) {
                setcurrentclass("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handlesearchOutside = (event) => {
            if (
                searchRef.current &&
                searchresultRef.current &&
                !searchRef.current.contains(event.target) &&
                !searchresultRef.current.contains(event.target)
            ) {
                setQuery('');
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handlesearchOutside);
        return () => {
            document.removeEventListener('mousedown', handlesearchOutside);
        };
    }, [query]);
    

    const handlesidebar=(e)=>{
       if(currclass===""){
        setcurrentclass("move-aside");
       }
       else if(currclass==="move-aside"){
        setcurrentclass("");
       }
    }

    const handleThemeToggle = () => {
        
        dispatch(toggleTheme());
    };

    return(
        <>
        <div className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <Link to="/home"><img src="https://res.cloudinary.com/dchjyy4cp/image/upload/v1740149240/Bondify/Assets/bondify-logo_aoip5y.png" alt="Logo" /></Link>
                </div>
                <Searchbar   searchRef={searchRef} searchresultRef={searchresultRef} query={query} setQuery={setQuery} showResults={showResults} setShowResults={setShowResults}/>
            </div>
            <div className="navbar-right">
                <button    className="theme-toggle" onClick={handleThemeToggle}>
                    {isDarkMode ? <BsSun /> : <BsMoonStars />}
                </button>
                <Badge badgeContent={totalunread || null } color="primary">

                <Link to="/chat"><MdMessage /></Link>  
    </Badge>
                <IoIosNotifications />
               
                <div ref={profileRef} onClick={(e)=>{handlesidebar(e)}} className={`nav profile-image`}>
                    <img className="navimg profile-img" 
                         src={profilePic} 
                         alt="Profile" />
                </div>
            </div>
        </div>
            <Sidebar sidebarRef={sidebarRef} currclass={currclass}/>
        </> 
    )
}
export default Navbar