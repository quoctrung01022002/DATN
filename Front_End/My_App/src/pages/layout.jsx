// JSX
import { useState, useEffect } from 'react';
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [haveSearch, setHaveSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const cookies = new Cookies(null, { path: '/' });
  const [countCart, setCountCart] = useState(isLoggedIn ? localStorage.getItem('countCart')||0 : 0);
  const renewToken = async () => {
    try {
        const refreshToken = cookies.get('refreshToken');

        if (!refreshToken) {
            throw new Error('Refresh token not found.');
        }

        const response = await fetch('https://localhost:7138/api/User/RenewToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken }),
        });
        const data = await response.json();
        const newRefreshToken = data.data;
        cookies.set('refreshToken', newRefreshToken);
        
        // Toast success message
        toast.success('Token renewed successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return newRefreshToken;
    } catch (error) {
        console.error('Renew token failed:', error.message);
        return null;
    }
  };
 
  useEffect(() => {
    // Renew token on mount and then every 2 hours (in milliseconds)
    const renewTokenInterval = setInterval(renewToken, 2 * 60 * 60 * 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(renewTokenInterval);
  }, []);
  return (
    <div className="layout-container">
      <Header className="header" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} countCart={countCart} setCountCart={setCountCart} setHaveSearch={setHaveSearch} userInfo={userInfo} setUserInfo={setUserInfo}/>
      <Outlet className="outlet" context={[isLoggedIn, setIsLoggedIn, setCountCart,haveSearch,setHaveSearch,userInfo, setUserInfo]} />
      <ToastContainer />
      <Footer className="footer" /> 
    </div>
  );
}
