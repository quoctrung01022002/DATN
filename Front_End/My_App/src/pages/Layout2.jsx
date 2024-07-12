// JSX
import { useState, useEffect } from 'react';
// import LoginAdmin from "../Components/Admin/LoginAdmin/LoginAdmin";

import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  

  

  return (
    <div className="layout-container">
      {/* <LoginAdmin className="login" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/> */}
      <Outlet className="outlet" context={[isLoggedIn, setIsLoggedIn,userInfo, setUserInfo]} />
      <ToastContainer />
    </div>
  );
}
