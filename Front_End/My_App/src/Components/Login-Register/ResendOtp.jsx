import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../../css/ResendAndVerifyOTP.css';

const ResendAndVerifyOTP = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(true); // Hiển thị form nhập email ban đầu
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái chờ xử lý

    const handleResendOTP = async () => {
        setIsLoading(true); // Bắt đầu chờ xử lý
        try {
            const response = await fetch('https://localhost:7138/api/User/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }

            setSuccessMessage('OTP mới được gửi tới email của bạn. Hãy kiểm tra hộp thư đến của bạn.');
            setError('');
            setShowEmailForm(false); // Ẩn form nhập email sau khi gửi lại OTP thành công
        } catch (error) {
            console.error('Failed to resend OTP:', error.message);
            setError('Failed to resend OTP. Please try again.');
            setSuccessMessage('');
        } finally {
            setIsLoading(false); // Kết thúc chờ xử lý
        }
    };

    return (
        <div className="resend-and-verify-otp-container">
            <form className="resend-and-verify-otp-form" onSubmit={(e) => e.preventDefault()}>
                {showEmailForm && (
                    <div className="form-group">
                        <h2 style={{ textAlign: 'center' }}>Gửi lại OTP</h2>
                        <div className="login-input-container">
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Nhập email" 
                                required 
                            />
                        </div>
                    </div>
                )}
                {showEmailForm && (
                    <button 
                        type="button" 
                        className="resend-otp-btn" 
                        onClick={handleResendOTP}
                        disabled={isLoading} // Vô hiệu hóa nút khi đang chờ xử lý
                    >
                        {isLoading ? 'Chờ xử lý...' : 'Gửi lại OTP'} 
                    </button>
                )}
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <Link to="/verifyotp" className="resend-btn">Nhập OTP</Link>
            </form>
        </div>
    );
};

export default ResendAndVerifyOTP;
