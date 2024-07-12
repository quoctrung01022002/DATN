import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

const LoginFormAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const cookies = new Cookies(null, { path: '/' });
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/navbar');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7138/api/User/Login1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        if (errorMessage.message === "You do not have permission to log in.") {
          toast.error('Bạn không có quyền đăng nhập.');
        } else {
          toast.error('Thông tin đăng nhập không đúng.');
        }
        return;
      }
  
      const data = await response.json();
      cookies.set('accessToken', data.data.accessToken);
      cookies.set('refreshToken', data.data.refreshToken);
      setIsLoggedIn(true);
      
      if (data.data.roleName === "Shipper") {
        navigate("/navbar1");
      } else {
        navigate("/navbar");
      }
      console.log("Role Name:", data.data.roleName);
    } catch (error) {
      toast.error('Lỗi trong quá trình đăng nhập.');
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2 style={{textAlign: "center"}} className="login-form-title">Admin Login</h2>
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
            <button type="submit" className="login-btn-primary">Đăng nhập</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormAdmin;
