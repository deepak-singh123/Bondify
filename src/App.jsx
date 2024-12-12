import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { fetchUserData } from './store/userSlice';
import { Outlet } from 'react-router-dom';
import { fetchuserposts } from './store/postSlice';
import { fetchfollowinginfo } from './store/followingSlice';
import { fetchfollowersinfo } from './store/followersSlice';

function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((store) => store.theme.isDarkMode);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    dispatch(fetchuserposts())
        .unwrap()
        .catch(err => console.error('Failed to fetch posts:', err));
}, [dispatch]);

useEffect(() => {
    dispatch(fetchfollowinginfo())
        .unwrap()
        .catch(err => console.error('Failed to fetch following info:', err));
}, [dispatch]);

useEffect(() => {
  dispatch(fetchfollowersinfo())
      .unwrap()
      .catch(err => console.error('Failed to fetch followers info:', err));
}, [dispatch]);


  return <Outlet />;
}

export default App;