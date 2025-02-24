import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import Signin from './components/Sign-in/Signin.jsx'
import {Provider} from "react-redux"
import { store } from './store/store.jsx'
import PathUpdater from './routing/pathupdate.jsx'
import ProfileUpload from './components/Profileupload/ProfileUpload.jsx'
import Home from './components/Home/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Infopage from './components/Profile-Info/Infopage.jsx'
import Chatlist from './components/Home/massages/Chatlist.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Signin /> },
      { 
        path: "/home", 
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {path:"/Profileinfo/:id", element:<ProtectedRoute><Infopage/></ProtectedRoute>},
      {path:"/chat",element:<ProtectedRoute><Chatlist/></ProtectedRoute>}
    ]
  },
  {
    path: "/profileupload",
    element: <ProtectedRoute><ProfileUpload /></ProtectedRoute>
  }, 
  { path: "/register", element: <Signin /> },
  { path: "/login", element: <Signin /> },
 
]);

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <RouterProvider router={router} />
      <PathUpdater/>
    </Provider>
  ,
)
