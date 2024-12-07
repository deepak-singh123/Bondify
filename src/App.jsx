import { useEffect } from 'react'
import './App.css'
import { fetchUserData } from './store/userSlice'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch])

  return <Outlet />
}

export default App