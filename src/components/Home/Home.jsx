import { useDispatch, useSelector } from "react-redux"
import Createpost from "./Createpost.jsx"
import Navbar from "./Nav"
import Postlist from "./Postlist.jsx"
import Sidebar from "./Sidebar"
import Usercard from "./Usercard.jsx"
import { useEffect } from "react"
import { fetchuserinfo } from "../../store/userinfoSlice.jsx"
import Connectionslists from "./Connectionslists.jsx"


const Home=()=>{
    const curruser = useSelector((store)=>store.user.user);
    const dispatch = useDispatch();
 
    return(
    <div className="home-container">
    <Navbar/>
    <Usercard/>
    <Connectionslists/>
    <div className="central-postlist-container">
    <Createpost/>
    <Postlist/>
    </div>
        </div>
    )
}
export default Home