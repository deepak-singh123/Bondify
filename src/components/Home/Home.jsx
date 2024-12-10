import Createpost from "./Createpost.jsx"
import Navbar from "./Nav"
import Postlist from "./Postlist.jsx"
import Sidebar from "./Sidebar"


const Home=()=>{
    return(
    <div className="home-container">
    <Navbar/>
    <Createpost/>
    <Postlist/>
        </div>
    )
}
export default Home