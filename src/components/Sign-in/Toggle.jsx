import { Link } from "react-router-dom"



const Toggle =({toggleForm})=>{
    return(
        <>
        
        <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Have an account already?</p>
            <Link to={"/login"}>  <button className="hidden" onClick={toggleForm}>Login</button></Link>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>NEW HERE!</h1>
            <p>Dont have an account?</p>
            <Link to={"/register"}><button className="hidden" onClick={toggleForm}>Register</button></Link>
          </div>
        </div>
      </div>
        </>
    )
}
export default Toggle