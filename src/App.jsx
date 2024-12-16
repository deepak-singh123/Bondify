import { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { fetchUserData } from './store/userSlice';
import { Outlet } from 'react-router-dom';
import { fetchuserposts } from './store/postSlice';
import { fetchfollowinginfo } from './store/followingSlice';
import { fetchfollowersinfo } from './store/followersSlice';
import { fetchuserinfo } from './store/userinfoSlice';
import { fetchAllUser } from './store/alluserSlice';

function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((store) => store.theme.isDarkMode);
  const curruser = useSelector((store) => store.user.user);


  // Step 1: Fetch curruser
  useEffect(() => {
    dispatch(fetchUserData())
      .unwrap()
      .catch(err => console.error('Failed to fetch user data:', err));
  }, [dispatch]);

  // Step 2: Dispatch dependent actions when curruser is available
  useEffect(() => {
    if (!curruser || !curruser._id) return; // Wait until curruser is available

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

  // Step 3: Handle dark mode
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
