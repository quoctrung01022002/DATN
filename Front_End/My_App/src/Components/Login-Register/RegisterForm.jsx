import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { 
  faEnvelope, 
  faLock, 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faEdit, 
  faEye, 
  faEyeSlash 
} from '@fortawesome/free-solid-svg-icons'; 
import { Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../css/RegisterForm.css'; 

const UserRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    gender: true, 
    cccd:'',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenderChange = (e) => {
    setFormData({
      ...formData,
      gender: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Hiển thị thông báo "Đợi 1 lát"
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsLoading(false); // Ẩn thông báo "Đợi 1 lát"
      return;
    }
    try {
      const response = await axios.post('https://localhost:7138/api/User/register', formData);
      console.log(response.data);
      setIsLoading(false); // Ẩn thông báo "Đợi 1 lát" khi hoàn thành xử lý submit
      navigate('/verifyotp');
    } catch (error) {
      console.error('Lỗi:', error.response.data);
      if (error.response.status === 400 && error.response.data.includes("Email is already registered")) {
        toast.error("Email đã được đăng ký trước đó. Vui lòng sử dụng một địa chỉ email khác.", {
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
        toast.error('Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.', {
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
      setIsLoading(false); // Ẩn thông báo "Đợi 1 lát" khi có lỗi xảy ra
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2 style={{ display: "block", textAlign: 'center', marginBottom: '20px' }}>Đăng ký</h2>
          {/* Input cho email */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>
          {/* Input cho mật khẩu */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập mật khẩu"
                required
              />
              <div className="register-input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>
          {/* Input xác nhận mật khẩu */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Xác nhận mật khẩu"
                required
              />
              <div className="register-input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>
          {/* Input cho họ */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập họ"
              />
            </div>
          </div>
          {/* Input cho tên */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập tên"
              />
            </div>
          </div>
          {/* Input cho số điện thoại */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
              </div>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          {/* Input cho địa chỉ */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
          {/* Input cho số CCCD */}
          <div className="register-form-group">
            <div className="register-input-group">
              <div className="register-input-group-prepend">
                <span className="register-input-group-text">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
              </div>
              <input
                type="text"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                className="register-form-control"
                placeholder="Nhập số CCCD"
              />
            </div>
          </div>
          {/* Input cho giới tính */}
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faEdit} className="input-icon" />
            <Radio.Group onChange={handleGenderChange} value={formData.gender}>
              <Radio value={false}>Nam</Radio>
              <Radio value={true}>Nữ</Radio>
            </Radio.Group>
          </div>
          {/* Nút đăng ký */}
          <div className="register-form-group">
          <button type="submit" className="btn btn-primary register-btn" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>
        <button onClick={handleBackToLogin} className="btn btn-link">Đã có tài khoản? Đăng nhập</button>
      </div>
    </div>
  );
};

export default UserRegisterForm;
