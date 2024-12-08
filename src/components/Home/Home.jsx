import Createpost from "./Createpost.jsx"
import Navbar from "./Nav"
import Sidebar from "./Sidebar"


const Home=()=>{
    return(
    <div className="home-container">
    <Navbar/>
    <Createpost/>
        </div>
    )
}
export default Home