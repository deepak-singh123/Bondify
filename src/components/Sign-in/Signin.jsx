import React, { useState, useEffect } from "react";
import Toggle from "./Toggle";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPath } from "../../store/pathSlice";
import "./Signin.css";
const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPath = useSelector((store) => store.path.currentPath);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: currentPath === "/register" ? "" : "",  // Ensure username is always a string
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
      const response = await fetch(`/auth/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setBackendError(result.message);

        if (route === "login") {
          navigate(result.redirectTo);
          dispatch(setPath(result.redirectTo));
        }
      } else {
        const error = await response.json();
        setBackendError(error.message);
      }
    } catch (error) {
      console.error(`Error on ${route}:`, error);
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
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span>{errors.password}</span>}
            <a href="#">Forgot Your Password?</a>
            <button type="submit">Login</button>
          </form>
        </div>

        <Toggle toggleForm={toggleForm} />
      </div>
    </div>
  );
};

export default Signin;
