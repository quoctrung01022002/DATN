import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Input, Radio } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../css/DashboradAdmin.css";
import { toast } from "react-toastify";

import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faImage,
  faEdit,
  faSignOutAlt,
  faWarehouse,
  faListAlt,
  faChartLine,
  faImages,
  faBox,
  faLifeRing,
  faPercentage,
  faAppleAlt,
  faNewspaper,
  faShoppingCart,
  faUsers,
  faChevronDown,
  faTasks,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import "../../../css/DashboradAdmin.css";
import Banner from "../Banner/Banner";
import Supportt from "../Support/Supportt";
import Revenue from "../Revenue/Revenue";
import ProductImageDetail from "../../ProductImageDetail/ProductImageDetail";
import ProductType from "../ProductType/ProductType";
import Supplier from "../Supplier/Supplier";
import Discount from "../Discount/Discount";
import Brand from "../Brand/Brand";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import ProductView from "../Product/ProductView";
import Post from "../Post/Post";
import Staff from "../User/Staff";
import Customer from "../User/Customer";
import Order from "../Order/Order";
import Introduce from "../Introduce/Introduce";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

function DashboardAdmin() {
  // Fixed typo in function name
  const [activeContent, setActiveContent] = useState("revenue");
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
  const [roleName, setRoleName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn, userInfo, setUserInfo] = useOutletContext();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

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
        setRoleName(response.data.roleName);
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
  const handleMenuClick = (content, requiredRole) => {
    if (roleName !== requiredRole) {
      toast.error("Bạn không thể vô menu này", {
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
      setActiveContent(content);
    }
  };
  const handleMenuClick1 = (content, role) => {
    if (role === "Admin" || role === "Accountant") {
      setActiveContent(content);
    } else {
      toast.error("Bạn không có quyền truy cập vào mục này", {
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
  const handleMenuClick2 = (content, role) => {
    if (role === "Admin" || role === "Support") {
      setActiveContent(content);
    } else {
      toast.error("Bạn không có quyền truy cập vào mục này", {
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

  const renderContent = () => {
    switch (activeContent) {
      case "order":
        return roleName === "Admin" || roleName === "Accountant" ? (
          <Order />
        ) : (
          <NotFoundPage />
        );
      case "staff":
        return roleName === "Admin" ? <Staff /> : <NotFoundPage />;
      case "customer":
        return roleName === "Admin" ? <Customer /> : <NotFoundPage />;
      case "banner":
        return roleName === "Admin" ? <Banner /> : <NotFoundPage />;
      case "introduce":
        return roleName === "Admin" ? <Introduce /> : <NotFoundPage />;
      case "post":
        return roleName === "Admin" ? <Post /> : <NotFoundPage />;
      case "brand":
        return roleName === "Admin" ? <Brand /> : <NotFoundPage />;
      case "producttype":
        return roleName === "Admin" ? <ProductType /> : <NotFoundPage />;
      case "supplier":
        return roleName === "Admin" ? <Supplier /> : <NotFoundPage />;
      case "discount":
        return roleName === "Admin" ? <Discount /> : <NotFoundPage />;
      case "productimagedetail":
        return roleName === "Admin" ? <ProductImageDetail /> : <NotFoundPage />;
      case "support":
        return roleName === "Admin" || roleName === "Support" ? (
          <Supportt />
        ) : (
          <NotFoundPage />
        );
      case "revenue":
        return <Revenue />;
      //   case "createProduct":
      //     return <CreateProduct />;
      case "productView":
        return roleName === "Admin" ? <ProductView /> : <NotFoundPage />;
      //   case "updateProduct":
      //     return <UpdateProduct />;
      default:
        return <Revenue />;
    }
  };
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen); // Toggle submenu state
  };

  return (
    <div>
      {/* <Header1 /> */}

      <div className="dashboard-container">
      <nav style={{ minWidth: "240px" }} className="navigation-menu">
          <ul className="menu-list">
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="options"
            >
              {isLoggedIn ? (
                <div
                  className="option logout1"
                  style={{ display: "flex", alignItems: "center",borderBottom: "1px solid black", paddingBottom: "5px"}}
                >
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
                          className="user-image card-img-top rounded-circle"
                          alt={userInfo.imageUser}
                          style={
                            {
                              marginRight: "-5px",
                              paddingBottom: "5px",
                            }
                          }
                          onClick={handleImageClick}
                        />

                        <p style={{ marginLeft: "10px", marginRight: "50px", marginBottom: " -5px" }}>
                          {userInfo.roleName}
                        </p>
                      </>
                    )}

                    <FontAwesomeIcon
                      style={{ cursor: "pointer",marginBottom: " -5px" }}
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
                activeContent === "revenue" ? "active" : ""
              }`}
            >
              <Link
                to="#"
                className="menu-link"
                onClick={() => setActiveContent("revenue")}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  style={{ marginRight: "10px" }}
                  className="icon"
                />
                Tổng quan
              </Link>
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={() => handleMenuClick1("order", roleName)}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{ marginRight: "10px" }}
                className="icon"
              />
              <span>Đơn hàng</span>
            </li>
            <li
              style={{
                listStyle: "none",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              className="menu-item"
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={toggleSubMenu}
              >
                <FontAwesomeIcon
                  icon={faUserCog}
                  style={{ marginRight: "10px" }}
                  className="icon"
                />
                <span>Quản lý người dùng</span>
                <FontAwesomeIcon // Mũi tên xuống
                  icon={faChevronDown}
                  style={{ marginLeft: "auto" }}
                />
              </div>
              {isSubMenuOpen && ( // Render submenu based on state
                <ul style={{ paddingLeft: "20px" }}>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("staff", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Nhân viên</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("customer", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Khách hàng</span>
                  </li>
                </ul>
              )}
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={toggleSubMenu} // Toggle submenu on click
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={faTasks}
                  style={{ marginRight: "10px" }}
                  className="icon"
                />
                <span>Quản lý chung</span>
                <FontAwesomeIcon // Mũi tên xuống
                  icon={faChevronDown}
                  style={{ marginLeft: "auto" }}
                />
              </div>
              {isSubMenuOpen && ( 
                <ul style={{ paddingLeft: "20px" }}>
                   <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleMenuClick("productView", "Admin")
                    }
                  >
                    <FontAwesomeIcon
                      icon={faAppleAlt}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Sản phẩm</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("producttype", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faListAlt}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Danh mục</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleMenuClick("productimagedetail", "Admin")
                    }
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Hình ảnh sản phẩm</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("supplier", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faWarehouse}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Nhà cung cấp</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("discount", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faPercentage}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Giảm giá</span>
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMenuClick("brand", "Admin")}
                  >
                    <FontAwesomeIcon
                      icon={faAppleAlt}
                      style={{ marginRight: "10px" }}
                      className="icon"
                    />
                    <span>Thương hiệu</span>
                  </li>
                </ul>
              )}
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={() => handleMenuClick("post", "Admin")}
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                style={{ marginRight: "10px" }}
                className="icon"
              />
              <span>Bài viết</span>
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={() => handleMenuClick("banner", "Admin")}
            >
              <FontAwesomeIcon
                icon={faImages}
                style={{ marginRight: "10px" }}
                className="icon"
              />
              <span>Banner</span>
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={() => handleMenuClick("introduce", "Admin")}
            >
              <FontAwesomeIcon
                icon={faImages}
                style={{ marginRight: "10px" }}
                className="icon"
              />
              <span>Giới thiệu</span>
            </li>
            <li
              style={{ listStyle: "none", marginBottom: "10px" }}
              className="menu-item"
              onClick={() => handleMenuClick2("support", roleName)}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{ marginRight: "10px" }}
                className="icon"
              />
              <span>Hỗ trợ</span>
            </li>
          </ul>
        </nav>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
