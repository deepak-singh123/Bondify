import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setPath } from '../store/pathSlice';

const PathUpdater = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPath(window.location.pathname)); 
  }, [location, dispatch]);

  return null; 
};

export default PathUpdater;
