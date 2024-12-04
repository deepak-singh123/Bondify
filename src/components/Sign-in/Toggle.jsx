import { Link } from "react-router-dom"



const Toggle =({toggleForm})=>{
    return(
        <>
        
        <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all site features</p>
            <Link to={"/login"}>  <button className="hidden" onClick={toggleForm}>Sign In</button></Link>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>NEW HERE!</h1>
            <p>Register with your personal details to use all site features</p>
            <Link to={"/register"}><button className="hidden" onClick={toggleForm}>Sign Up</button></Link>
          </div>
        </div>
      </div>
        </>
    )
}
export default Toggle