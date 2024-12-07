import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaSearch } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { MdMessage } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import "./Home.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";


const Navbar=()=>{

    const curruser = useSelector((store)=>store.user.user)
    const [currclass, setcurrentclass] = useState("");
    const handlesidebar=(e)=>{
       if(currclass===""){
        setcurrentclass("active");
       }
       else{
        setcurrentclass("");
       }
    }


    return(

        <>
        <div className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <Link to="/home"><img src="/src/assets/images/bondify-logo.png" alt="Logo" /></Link>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                    <span><FaSearch />  </span>           </div>
            </div>
            <div className="navbar-right">

                <MdPeopleAlt />
                <MdMessage />
                <IoIosNotifications />

                    <div  onClick={()=>{handlesidebar}} className={` ${currclass} nav profile-image`}>
                    <img className="navimg profile-img" 
                         src={curruser?.profilePicture || '/src/assets/images/default-profile.png'} 
                         alt="Profile" />
                </div>
            </div>
        </div>

        </> 
    )
}
export default Navbar