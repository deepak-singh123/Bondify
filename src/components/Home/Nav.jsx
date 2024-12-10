import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaSearch } from "react-icons/fa";
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

const Navbar=()=>{
    const curruser = useSelector((store)=>store.user.user)
    const isDarkMode = useSelector((store)=>store.theme.isDarkMode)
    const dispatch = useDispatch();
    const [currclass, setcurrentclass] = useState("");
    const [profilePic, setProfilePic] = useState('/src/assets/images/default-profile.jpg');
    const sidebarRef = useRef(null);
    const profileRef = useRef(null);
    useEffect(() => {
        const checkProfilePicture = () => {
            if (curruser?.profilePicture) {
                setProfilePic(curruser.profilePicture);
            } else if (curruser) {
                // If user exists but no profile picture, retry after a short delay
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
                    <Link to="/home"><img src="/src/assets/images/bondify-logo.png" alt="Logo" /></Link>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                    <span><FaSearch />  </span>
                </div>
            </div>
            <div className="navbar-right">
                <button className="theme-toggle" onClick={handleThemeToggle}>
                    {isDarkMode ? <BsSun /> : <BsMoonStars />}
                </button>
                <MdPeopleAlt />
                <MdMessage />
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