import React, { useState, useEffect } from "react";
import Toggle from "./Toggle";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPath } from "../../store/pathSlice";
import { setUser } from "../../store/userSlice";
import "./Signin.css";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = useSelector((store) => store.path.currentPath);
  const curruser = useSelector((store) => store.user.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: currentPath === "/register" ? "" : "",
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (currentPath === "/register" && !formData.username)
      formErrors.username = "Username is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const route = currentPath === "/register" ? "register" : "login";

    try {
      const response = await fetch(`https://bondify-1lzw.onrender.com/auth/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',  // Important for setting cookies
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear any previous backend errors
        setBackendError("");

        if (route === "login") {
          // Navigate based on backend response
        
          navigate(result.redirectTo);
          dispatch(setPath(result.redirectTo));
        } else if (route === "register") {
          // For registration, navigate to login
          navigate("/login");
          dispatch(setPath("/login"));
        }
      } else {
        // Handle backend errors
        setBackendError(result.message || "An error occurred");
      }
    } catch (error) {
      console.error(`Error on ${route}:`, error);
      setBackendError("Network error. Please try again.");
    }
  };

  const toggleForm = () => {
    const newPath = currentPath === "/login" ? "/register" : "/login";
    navigate(newPath);
    dispatch(setPath(newPath));
    setErrors({});
  };

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      username: currentPath === "/register" ? "" : "",  // Ensure username is always a string
    });
    setErrors({});
    setBackendError("");
  }, [currentPath]);

  return (
    <div className="signin-page">
      <div className={`container ${currentPath === "/register" ? "active" : ""}`}>
        <div className={`form-container sign-up ${currentPath === "/register" ? "active" : ""}`}>
          <form onSubmit={onSubmit}>
            <h1>Create Account</h1>
            {backendError && <h3 className="error-message" style={{ color: "red" }}>{backendError}</h3>}
            <input type="text" placeholder="Username" name="username" value={formData.username || ""} onChange={handleChange} />
            {errors.username && <span>{errors.username}</span>}
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span>{errors.password}</span>}
            <button type="submit">Register</button>
          </form>
        </div>

        <div className={`form-container sign-in ${currentPath === "/login" ? "active" : ""}`}>
          <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            {backendError && <h3 className="error-message" style={{ color: "red" }}>{backendError}</h3>}
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span>{errors.password}</span>}
            <button type="submit">Sign In</button>
          </form>
        </div>

        <Toggle toggleForm={toggleForm} />
      </div>
    </div>
  );
}

export default Signin;
