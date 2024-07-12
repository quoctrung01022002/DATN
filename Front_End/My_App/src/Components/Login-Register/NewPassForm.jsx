import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/NewPassword.css';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7138/api/User/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,otp, password, confirmPassword }),
      });
      if (!response.ok) {
        throw new Error('Cập nhật mật khẩu không thành công');
      }
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi cập nhật mật khẩu:', error.message);
      setError('Cập nhật mật khẩu không thành công. Vui lòng kiểm tra lại thông tin và thử lại.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form-container">
        <h2 style={{display: "block"}} className="reset-password-form-title">Cập nhật mật khẩu mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="reset-password-form-group">
            <div className="reset-password-input-container">
              <FontAwesomeIcon icon={faEnvelope} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="reset-password-form-control" placeholder="Nhập email" required />
            </div>
          </div>
          <div className="reset-password-form-group">
            <div className="reset-password-input-container">
              <FontAwesomeIcon icon={faKey} />
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="reset-password-form-control" placeholder="Nhập mã OTP" required />
            </div>
          </div>
          <div className="reset-password-form-group">
            <div className="reset-password-input-container">
              <FontAwesomeIcon icon={faLock} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="reset-password-form-control" placeholder="Nhập mật khẩu mới" required />
            </div>
          </div>
          <div className="reset-password-form-group">
            <div className="reset-password-input-container">
              <FontAwesomeIcon icon={faLock} />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="reset-password-form-control" placeholder="Xác nhận mật khẩu mới" required />
            </div>
          </div>
          <div className="reset-password-button-container">
            <button type="submit" className="reset-password-btn-submit">Cập nhật mật khẩu</button>
            <Link to="/login" className="reset-password-btn-back">Quay lại trang đăng nhập</Link>
          </div>
          {error && <p className="reset-password-error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
