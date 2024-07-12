import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Input, Radio } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faImage,
  faEdit,
  faSignOutAlt,
  faAppleAlt,
  faNewspaper,
  faListAlt,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import "../../../css/DashboradAdmin.css";
import Status1 from "../Shipping/Status1";
import Status2 from "../Shipping/Status2";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

function DashboardAdmin() {
  // Fixed typo in function name
  const [activeContent, setActiveContent] = useState("support");
  // const [userInfo, setUserInfo] = useState(null);
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn, userInfo, setUserInfo] = useOutletContext();

  useEffect(() => {
    fetchUserInformation();
  }, []);

  useEffect(() => {
    setIsModalVisible(false); // Reset modal state when switching content
  }, [activeContent]);

  const fetchUserInformation = async () => {
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      const { userId } = getUserIdFromToken(accessToken);
      try {
        const response = await axios.get(
          `https://localhost:7138/api/User1/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
          }
        );
        setIsLoggedIn(true);
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
    } else {
      setUserInfo(null);
    }
  };

  const getUserIdFromToken = (token) => {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
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
      console.log(updatedUserInfo);

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

      await fetchUserInformation(userInfo.userId);

      setIsModalVisible(false);
      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserInfo({ ...updatedUserInfo, [name]: value });
  };

  const handleGenderChange = (event) => {
    setUpdatedUserInfo({ ...updatedUserInfo, gender: event.target.value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setUpdatedUserInfo({ ...updatedUserInfo, ImageFile: imageFile });
  };

  const handleLogout = () => {
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    setIsLoggedIn(false);
    window.location.href = "/login";
    setUserInfo(null);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "status1":
        return <Status1 />;
      case "status2":
        return <Status2 />;
      default:
        return <Status1 />;
    }
  };

  return (
    <div>
      {/* <Header1 /> */}

      <div className="dashboard-container">
        <nav className="navigation-menu">
          <ul className="menu-list">
            <div className="options" style={{ display: "flex", alignItems: "center" }}>
              {isLoggedIn ? (
                <div className="option logout1"  style={{ display: "flex", alignItems: "center",borderBottom: "1px solid black", paddingBottom: "5px" }}>
                  <Modal
                    title="Chỉnh sửa thông tin"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                      <Button
                        key="cancel"
                        onClick={() => setIsModalVisible(false)}
                      >
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
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <Input
                        type="text"
                        name="firstName"
                        value={updatedUserInfo.firstName}
                        onChange={handleChange}
                        placeholder="Họ"
                      />
                    </div>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <Input
                        type="text"
                        name="lastName"
                        value={updatedUserInfo.lastName}
                        onChange={handleChange}
                        placeholder="Tên"
                      />
                    </div>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faPhone} className="input-icon" />
                      <Input
                        type="text"
                        name="phoneNumber"
                        value={updatedUserInfo.phoneNumber}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                      />
                    </div>
                    <div className="input-with-icon">
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
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                      <Input
                        type="text"
                        name="cccd"
                        value={updatedUserInfo.cccd}
                        onChange={handleChange}
                        placeholder="Số CCCD"
                      />
                    </div>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faImage} className="input-icon" />
                      <Input
                        type="file"
                        name="ImageFile"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="input-with-icon">
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

                  <>
                    {userInfo && (
                      <>
                        <img
                          src={`https://localhost:7138${userInfo.imageUser}`}
                          className="card-img-top"
                          alt={userInfo.imageUser}
                          style={{ maxWidth: "50px", height: "auto" }}
                          onClick={handleImageClick}
                        />
                        <p style={{ marginLeft: "10px", marginRight: "50px", marginBottom: " -5px" }}>
                          {userInfo.roleName}
                        </p>
                      </>
                    )}
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      onClick={handleLogout}
                      className="logout-icon"
                    />
                  </>
                </div>
              ) : null}
            </div>
            <li
              className={`menu-item ${
                activeContent === "status1" ? "active" : ""
              }`}
            >
              <Link
                to="#"
                className="menu-link"
                onClick={() => setActiveContent("status1")}
              >
                <FontAwesomeIcon icon={faListAlt} className="icon" />
                Tất cả đơn hàng
              </Link>
            </li>
            <li
              className={`menu-item ${
                activeContent === "status2" ? "active" : ""
              }`}
            >
              <Link
                to="#"
                className="menu-link"
                onClick={() => setActiveContent("status2")}
              >
                <FontAwesomeIcon icon={faCheckSquare} className="icon" />
                Đơn hàng đã nhận
              </Link>
            </li>
          </ul>
        </nav>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
