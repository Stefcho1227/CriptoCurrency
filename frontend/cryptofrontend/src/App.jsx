//import {createBrowserRouter, RouterProvider}  from "react-router";

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
const router = createBrowserRouter([{
  path:'/',
  element:<Dashboard/>
}, {
  path:'/login',
  element:<Login/>
}])
function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
