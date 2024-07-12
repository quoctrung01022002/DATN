// LoginForm.jsx

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import axios from "axios";
import '../../css/Login.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State cho tính năng "Nhớ tài khoản"
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [showPassword, setShowPassword] = useState(false);
  const [,,setCountCart] = useOutletContext();
  const cookies = new Cookies(null, { path: '/' });
  
  useEffect(() => {
    // Kiểm tra xem có cookie "rememberMe" đã lưu trước đó không
    const rememberMeCookie = cookies.get('rememberMe');
    if (rememberMeCookie) {
      setRememberMe(true);
      const storedEmail = cookies.get('email');
      if (storedEmail) setEmail(storedEmail);
    }
  }, []); // Chỉ chạy một lần sau khi component được render
  
  if (isLoggedIn) {
    navigate('/check');
  }

  const handleForgotPasswordClick = () => {
    navigate('/forgotpass');
  };

  const handleRegisterNowClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Nếu người dùng chọn "Nhớ tài khoản", lưu email vào cookie
      if (rememberMe) {
        cookies.set('email', email, { path: '/' });
        cookies.set('rememberMe', true, { path: '/' });
      } else {
        cookies.remove('email', { path: '/' });
        cookies.remove('rememberMe', { path: '/' });
      }
      
      const response = await fetch('https://localhost:7138/api/User/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        if (errorMessage.message === "You do not have permission to log in.") {
          toast.error('Bạn không có quyền đăng nhập.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          toast.error('Thông tin đăng nhập không đúng.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        return;
      }
  
      const data = await response.json();
      cookies.set('accessToken', data.data.accessToken);
      cookies.set('refreshToken', data.data.refreshToken);
      const numberCart = await axios.get("https://localhost:7138/api/Product/CountUniqueProducts", {
        headers: {
          "Authorization": `Bearer ${cookies.get("accessToken")}`
        }
      });
      localStorage.setItem("countCart", numberCart.data);
      setCountCart(numberCart.data);
      setIsLoggedIn(true);
  
      if (data.data.roleName === "Shipper") {
        navigate("/navbar1");
      } else if (data.data.roleName === "Customer") {
        navigate("/check");
      } else {
        navigate("/navbar");
      }
    } catch (error) {
      toast.error('Lỗi trong quá trình đăng nhập.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2 style={{display: "block"}} className="login-form-title">Đăng nhập</h2>
          <div className="login-form-group">
            <div className="login-input-group">
              <div className="login-input-group-prepend">
                <span className="login-input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-form-control" placeholder="Nhập email" required />
            </div>
          </div>
          <div className="login-form-group">
            <div className="login-input-group">
              <div className="login-input-group-prepend">
                <span className="login-input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="login-form-control" 
                placeholder="Nhập mật khẩu" 
                required 
              />
              <div className="login-input-group-append">
                <button 
                  className="login-btn-toggle-password" 
                  type="button" 
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>
          <div className="login-form-group">
            <label>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              Nhớ tài khoản
            </label>
          </div>
          <div className="login-form-group">
            <button type="submit" className="login-btn-primary">Đăng nhập</button>
          </div>
          <div className="login-form-group">
            <button type="button" className="login-btn-link" onClick={handleForgotPasswordClick}>Quên mật khẩu</button>
            <button type="button" className="login-btn-link" onClick={handleRegisterNowClick}>Đăng ký ngay!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
