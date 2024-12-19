import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchUserData } from './store/userSlice';
import { fetchuserposts } from './store/postSlice';
import { fetchfollowinginfo } from './store/followingSlice';
import { fetchfollowersinfo } from './store/followersSlice';
import { fetchuserinfo } from './store/userinfoSlice';
import { fetchAllUser } from './store/alluserSlice';

const SOCKET_SERVER_URL = "http://localhost:3000";

// Create and export the socket instance
export const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true,
});

function App() {

  


  const dispatch = useDispatch();
  const isDarkMode = useSelector((store) => store.theme.isDarkMode);
  const curruser = useSelector((store) => store.user.user);
  useEffect(() => {
    dispatch(fetchUserData())
      .unwrap()
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, [dispatch]);




  useEffect(() => {
    if (!curruser || !curruser._id) return;

    dispatch(fetchuserinfo(curruser._id))
      .unwrap()
      .catch((err) => console.error("Error fetching user info:", err));

    dispatch(fetchuserposts())
      .unwrap()
      .catch((err) => console.error("Failed to fetch posts:", err));

    dispatch(fetchfollowinginfo())
      .unwrap()
      .catch((err) => console.error("Failed to fetch following info:", err));

    dispatch(fetchfollowersinfo())
      .unwrap()
      .catch((err) => console.error("Failed to fetch followers info:", err));

    dispatch(fetchAllUser())
      .unwrap()
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, [curruser, dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  


  return <Outlet />;
}

export default App;
