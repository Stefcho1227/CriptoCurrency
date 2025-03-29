//import {createBrowserRouter, RouterProvider}  from "react-router";

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import BuyCrypto from "./pages/BuyCrypto.jsx";
import SellCrypto from "./pages/SellCrypto.jsx";
const router = createBrowserRouter([{
  path:'/',
  element:<Dashboard/>
}, {
  path:'/login',
  element:<Login/>
},
  {
    path:'/register',
    element:<Register/>
  },
  {
    path:'/account',
    element:<Account/>,

  },
  {
    path: '/buy',
    element: <BuyCrypto />
  }, {
    path: '/sell',
    element: <SellCrypto />
  }])
function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
