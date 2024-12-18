import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import Socket.IO client
import { fetchUserData } from './store/userSlice';
import { fetchuserposts } from './store/postSlice';
import { fetchfollowinginfo } from './store/followingSlice';
import { fetchfollowersinfo } from './store/followersSlice';
import { fetchuserinfo } from './store/userinfoSlice';
import { fetchAllUser } from './store/alluserSlice';

// Replace with your backend server's UR.
const SOCKET_SERVER_URL = "http://localhost:3000"; 

function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((store) => store.theme.isDarkMode);
  const curruser = useSelector((store) => store.user.user);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true, // Include cookies if necessary
    });

    // Step 1: Emit `user_online` event when the user data is available
    if (curruser && curruser._id) {
      socket.emit("user_online", curruser._id);
    }

    // Step 2: Listen for events (e.g., messages)
    socket.on("receive_message", (message) => {
      console.log("New message received:", message);
      // Here, you can dispatch Redux actions to update the state (e.g., add to chat history)
    });

    // Step 3: Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [curruser]);

  // Step 4: Fetch user data and handle dependencies
  useEffect(() => {
    dispatch(fetchUserData())
      .unwrap()
      .catch(err => console.error('Failed to fetch user data:', err));
  }, [dispatch]);

  useEffect(() => {
    if (!curruser || !curruser._id) return;

    dispatch(fetchuserinfo(curruser._id))
      .unwrap()
      .catch(err => console.error("Error fetching user info:", err));

    dispatch(fetchuserposts())
      .unwrap()
      .catch(err => console.error('Failed to fetch posts:', err));

    dispatch(fetchfollowinginfo())
      .unwrap()
      .catch(err => console.error('Failed to fetch following info:', err));

    dispatch(fetchfollowersinfo())
      .unwrap()
      .catch(err => console.error('Failed to fetch followers info:', err));

    dispatch(fetchAllUser())
      .unwrap()
      .catch(err => console.error('Failed to fetch user data:', err));
  }, [curruser, dispatch]);

  // Step 5: Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return <Outlet />;
}

export default App;
