import Createpost from "./Createpost.jsx"
import Navbar from "./Nav"
import Postlist from "./Postlist.jsx"
import Sidebar from "./Sidebar"


const Home=()=>{
    return(
    <div className="home-container">
    <Navbar/>

    <div className="central-postlist-container">
    <Createpost/>
    <Postlist/>
    </div>
        </div>
    )
}
export default Home