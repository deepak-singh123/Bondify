import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import Signin from './components/Sign-in/Signin.jsx'
import {Provider} from "react-redux"
import store from './store/store.jsx'
import PathUpdater from './routing/pathupdate.jsx'
import ProfileUpload from './components/Profileupload/ProfileUpload.jsx'
import Home from './components/Home/Home.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Signin /> },
     
   
      { path: "/home", element: <Home /> },
      
    ]
  },
  {
    path: "/profileupload",
    element: <ProfileUpload />
  }, { path: "/register", element: <Signin /> },
  { path: "/login", element: <Signin /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <PathUpdater/>
    </Provider>
  </StrictMode>,
)
