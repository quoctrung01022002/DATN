import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../../css/Forgot.css';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const response = await fetch(`https://localhost:7138/api/User/forgot-password?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to send OTP.');
      }
      setSuccessMessage('OTP sent to your email. Please check your inbox.');
      setIsLoading(false); 
      navigate('/newpassword');
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false); 
    }
  };
  
  const handleRegisterNowClick = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form-container">
        <h2 style={{ display: "block" }} className="forgot-form-title">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <div className="forgot-input-container">
              <FontAwesomeIcon icon={faEnvelope} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="forgot-form-control" placeholder="Enter your email" required />
            </div>
          </div>
          <button type="submit" className="forgot-btn-submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Gửi OTP"}
          </button>
          <button type="button" className="login-btn-link" onClick={handleRegisterNowClick}>Quay lại trang đăng nhập</button>
          {error && <p className="forgot-error-message">{error}</p>}
          {successMessage && <p className="forgot-success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
