import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons'; // Import icon faKey từ thư viện FontAwesome
import '../../css/VerifyOtp.css';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError("Please provide an OTP.");
            return;
        }
        
        try {
            const response = await fetch('https://localhost:7138/api/User/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify OTP');
            }

            navigate('/login'); // Chuyển hướng về trang đăng nhập sau khi xác minh thành công
        } catch (error) {
            console.error('Failed to verify OTP:', error.message);
            setError('Failed to verify OTP. Please try again.');
        }
    };

    return (
        <div className="verify-otp-container">
            <form className="verify-otp-form" onSubmit={handleSubmit}> 
                <h2 style={{display: "block", textAlign: 'center' }} className="verify-otp-title">Xác minh OTP</h2>
                <div className="verify-otp-input-container">
                    <FontAwesomeIcon icon={faKey} className="verify-otp-input-icon" />
                    <input type="text" value={otp} placeholder="Nhập Otp"  onChange={(e) => setOtp(e.target.value)} />
                </div>
                <button type="submit" className="verify-otp-submit-btn">Xác nhận</button>
                <Link to="/resendotp" className="verify-otp-resend-link">Gửi OTP</Link>
                <Link to="/register" className="verify-otp-back-link">Quay lại trang đăng ký</Link>
                {error && <p className="verify-otp-error-message">{error}</p>}
            </form>
        </div>
    );
};

export default VerifyOtp;
