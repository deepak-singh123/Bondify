import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { fetchUserData } from './store/userSlice';
import { Outlet } from 'react-router-dom';

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

  return <Outlet />;
}

export default App;