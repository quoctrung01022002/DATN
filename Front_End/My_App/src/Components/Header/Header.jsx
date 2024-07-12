import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faSignOutAlt,
  faEdit,
  faUser,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faImage,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logofood.png";
import "../../css/Header.css";
import { Badge, Dropdown, Modal, Input, Button, Radio } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import "../../css/Header.css";
import NamImage from "../../assets/Nam.jpg";
import NuImage from "../../assets/Nu.jpg";
const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  countCart,
  setCountCart,
  setHaveSearch,
  setUserInfo,
  userInfo,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    cccd: "",
    gender: false,
    ImageFile: null,
  });
  const cookies = new Cookies(null, { path: "/" });
  const [isNavlistOpen, setIsNavlistOpen] = useState(false);

  const getUserIdFromToken = (token) => {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:7138/api/User1/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      setUserInfo(response.data);
      setUpdatedUserInfo({
        ...updatedUserInfo,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        address: response.data.address,
        cccd: response.data.cccd,
        gender: response.data.gender === "Nữ",
      });
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  const countCartFunction = async () => {
    try {
      const numberCart = await axios.get(
        "https://localhost:7138/api/Product/CountUniqueProducts",
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      setCountCart(numberCart.data);
    } catch (error) {
      console.error("Error counting cart: ", error);
    }
  };

  useEffect(() => {
    console.log("Using effect");
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      const { userId } = getUserIdFromToken(accessToken);
      setIsLoggedIn(true);
      fetchUserInfo(userId);
      countCartFunction();
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
      setCountCart(0);
    }
  }, [isLoggedIn, setUserInfo, setCountCart]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setHaveSearch((pre) => !pre);
    let search = null;
    if (searchTerm?.includes("%")) {
      const number = searchTerm.slice(0, searchTerm.indexOf("%"));
      search = number / 100;
    }
    navigate({
      pathname: "/check",
      search: `?keyword=${search ? search.toString() : searchTerm}`,
    });
  };

  const handleLogout = () => {
    const confirmation = window.confirm("Bạn có chắc chắn đăng xuất?");
    if (confirmation) {
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      setIsLoggedIn(false);
      navigate("/login");
      localStorage.setItem("countCart", 0);
      setCountCart(0);
    }
  };

  const handleTrackOrder = () => {
    navigate("/orderuserid");
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
  };

  const handleSaveProfile = async () => {
    try {
      if (!userInfo) {
        console.error("User info is null");
        return;
      }

      const formData = new FormData();
      formData.append("firstName", updatedUserInfo.firstName);
      formData.append("lastName", updatedUserInfo.lastName);
      formData.append("phoneNumber", updatedUserInfo.phoneNumber);
      formData.append("address", updatedUserInfo.address);
      formData.append("cccd", updatedUserInfo.cccd);
      formData.append("gender", updatedUserInfo.gender);
      if (updatedUserInfo.ImageFile) {
        formData.append("ImageFile", updatedUserInfo.ImageFile);
      }

      await axios.put(
        `https://localhost:7138/api/User1/${userInfo.userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("--------", userInfo.userId);
      await fetchUserInfo(userInfo.userId);

      setIsModalVisible(false);
      console.log("User profile updated successfully!!!!");
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <Link target="_blank" rel="noopener noreferrer" to="/login">
          Đăng Nhập
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link target="_blank" rel="noopener noreferrer" to="/Register">
          Đăng Ký
        </Link>
      ),
    },
  ];

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để vào giỏ hàng!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    navigate("/CheckCard");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("handleChange", name, value);
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
  };

  const handleGenderChange = (event) => {
    setUpdatedUserInfo({ ...updatedUserInfo, gender: event.target.value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setUpdatedUserInfo({ ...updatedUserInfo, ImageFile: imageFile });
  };

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <img src={Logo} alt="S.Fresh" style={{ height: "100px" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsNavlistOpen(!isNavlistOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isNavlistOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/introducemenu">
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/check">
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/postt">
                Tin tức
              </a>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <Link className="nav-link" to="/support">
                  Liên hệ
                </Link>
              ) : (
                <a className="nav-link" href="/login">
                  Liên hệ
                </a>
              )}
            </li>
          </ul>
          <div className="d-flex">
            <div className="search me-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleSearchSubmit}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="options d-flex align-items-center">
              {isLoggedIn ? (
                <>
                  <div className="dropdown me-3">
                    {userInfo && (
                      <img
                        src={
                          userInfo.imageUser
                            ? `https://localhost:7138${userInfo.imageUser}`
                            : userInfo.gender
                            ? NuImage
                            : NamImage
                        }
                        className="img-thumbnail"
                        alt="User Avatar"
                        style={{ width: "70px", cursor: "pointer" }}
                        onClick={handleImageClick}
                      />
                    )}
                    <Modal
                      title="Chỉnh sửa thông tin"
                      style={{ marginTop: "100px" }}
                      visible={isModalVisible}
                      onCancel={handleCancelEdit}
                      footer={[
                        <Button key="cancel" onClick={handleCancelEdit}>
                          Hủy
                        </Button>,
                        <Button
                          key="save"
                          type="primary"
                          onClick={handleSaveProfile}
                        >
                          Lưu
                        </Button>,
                      ]}
                    >
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        <Input
                          type="text"
                          name="firstName"
                          value={updatedUserInfo.firstName}
                          onChange={handleChange}
                          placeholder="Họ"
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        <Input
                          type="text"
                          name="lastName"
                          value={updatedUserInfo.lastName}
                          onChange={handleChange}
                          placeholder="Tên"
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="input-icon"
                        />
                        <Input
                          type="text"
                          name="phoneNumber"
                          value={updatedUserInfo.phoneNumber}
                          onChange={handleChange}
                          placeholder="Số điện thoại"
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="input-icon"
                        />
                        <Input
                          type="text"
                          name="address"
                          value={updatedUserInfo.address}
                          onChange={handleChange}
                          placeholder="Địa chỉ"
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon
                          icon={faIdCard}
                          className="input-icon"
                        />
                        <Input
                          type="text"
                          name="cccd"
                          value={updatedUserInfo.cccd}
                          onChange={handleChange}
                          placeholder="Số CCCD"
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon
                          icon={faImage}
                          className="input-icon"
                        />
                        <Input
                          type="file"
                          name="ImageFile"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="input-with-icon mb-2">
                        <FontAwesomeIcon icon={faEdit} className="input-icon" />
                        <Radio.Group
                          onChange={handleGenderChange}
                          value={updatedUserInfo.gender}
                        >
                          <Radio value={false}>Nam</Radio>
                          <Radio value={true}>Nữ</Radio>
                        </Radio.Group>
                      </div>
                    </Modal>
                  </div>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    onClick={handleLogout}
                    style={{
                      cursor: "pointer",
                      marginRight: "15px",
                      fontSize: "24px",
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faShippingFast}
                    onClick={handleTrackOrder}
                    style={{
                      cursor: "pointer",
                      marginRight: "15px",
                      fontSize: "24px",
                    }}
                  />
                  <div className="option cart" onClick={handleCartClick}>
                    <Badge count={countCart}>
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        style={{ cursor: "pointer", fontSize: "24px" }}
                      />
                    </Badge>
                  </div>
                </>
              ) : (
                <Dropdown menu={{ items }} placement="bottom">
                  <UserOutlined style={{ cursor: "pointer" }} />
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
