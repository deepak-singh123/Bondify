import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import Signin from './components/Sign-in/Signin.jsx'
import {Provider} from "react-redux"
import store from './store/store.jsx'
import PathUpdater from './routing/pathupdate.jsx'
const router=createBrowserRouter(
  [
    {path:"/" , element:<App/>},
    {path:"/register", element:<Signin/>},
    {path:"/login", element:<Signin/>}
]
);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> 
    <RouterProvider  router={router}/>
    <PathUpdater/>
    </Provider>
  </StrictMode>,
)
