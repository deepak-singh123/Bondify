import { useState } from "react";
const toggleButton = document.querySelector('.toggle-button');
const container = document.querySelector('.container');


const Signin = () => {
  // State to toggle between login and sign-up form
  const [activePanel, setActivePanel] = useState("login");

  const toggleForm = () => {
    setActivePanel(activePanel === "login" ? "signup" : "login");
  };

  return (
    <div className={`container ${activePanel === "signup" ? "active" : ""}`} id="container">
      {/* Sign-Up Form */}
      <div className={`form-container sign-up ${activePanel === "signup" ? "active" : ""}`}>
        <form method="post" action="/register">
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" name="name" />
          <input type="email" placeholder="Email" name="username" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit">Register</button>
        </form>
      </div>

      {/* Sign-In Form */}
      <div className={`form-container sign-in ${activePanel === "login" ? "active" : ""}`} id="signin">
        <form action="/login" method="post">
          <h1>Sign In</h1>
      
          <span>or use your email password</span>
          <br/>
          <input type="email" placeholder="Email" name="username" />
          <input type="password" placeholder="Password" name="password" />
          <a href="#">Forgot Your Password?</a>
          <button id="signin-btn" type="submit">Login</button>
        </form>
      </div>

      {/* Toggle Section */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all site features</p>
            <button className="hidden" onClick={toggleForm}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>NEW HERE!</h1>
            <p>Register with your personal details to use all site features</p>
            <button className="hidden" onClick={toggleForm}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
