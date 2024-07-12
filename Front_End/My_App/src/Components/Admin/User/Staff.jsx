import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    gender: "",
    cccd: "",
    roleName: "",
    ImageFile: null,
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7138/api/User1/GetAllStaff"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      cccd: user.cccd,
      roleName: user.roleName,
      ImageFile: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      cccd: "",
      roleName: "",
      ImageFile: null,
    });
    setShowPasswordFields(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFormData({ ...formData, ImageFile: imageFile });
  };

  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("cccd", formData.cccd);
      formDataToSend.append("roleName", formData.roleName);
      formDataToSend.append("ImageFile", formData.ImageFile);

      const response = await axios.put(
        `https://localhost:7138/api/User1/${editingUser.userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        setEditingUser(null);
        fetchData();
        toast.success("User updated successfully.", {
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
        console.error("Error updating user:", response.statusText);
        toast.error("Failed to update user. Please try again later.", {
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
    } catch (error) {
      toast.error("Failed to update user. Please try again later.", {
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

  const handleAddUser = async () => {
    try {
      const formDataToSend = new FormData();
      console.log(formData);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("cccd", formData.cccd);
      formDataToSend.append("roleName", formData.roleName);
      formDataToSend.append("ImageFile", formData.ImageFile);

      const response = await axios.post(
        "https://localhost:7138/api/User1",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          gender: "",
          cccd: "",
          roleName: "",
          ImageFile: null,
        });
        fetchData();
        toast.success("Người dùng đã thêm thành công.", {
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
        console.error("Error adding user:", response.statusText);
        toast.error("Không thể thêm người dùng. Vui lòng thử lại sau.", {
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
    } catch (error) {
      toast.error("Failed to add user. Please try again later.", {
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

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/User1/${userId}`);
        setUsers(users.filter((user) => user.userId !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowModalImageUrl(true);
  };

  useEffect(() => {
    setShowPasswordFields(!editingUser);
  }, [editingUser]);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            className={i === currentPage ? "active" : ""}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="table-wrapper">
      <div style={{ marginTop: "-25px" }} className="container">
        <h2
          style={{ textAlign: "center", display: "block" }}
          className="mt-4 mb-4"
        >
          Danh Sách Nhân Viên
        </h2>
        <Button
          style={{ marginTop: "-50px" }}
          variant="success"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm mới nhân viên
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Ảnh nhân viên</th>
              <th scope="col">Họ</th>
              <th scope="col">Tên</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Giới tính</th>
              <th scope="col">Căn cước công dân</th>
              <th scope="col">Vai trò</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                {user.imageUser && (
                  <img
                    src={`https://localhost:7138${user.imageUser}`}
                    alt={user.title}
                    style={{
                      maxWidth: "100px",
                      cursor: "pointer",
                      borderRadius: "50%", // Làm cho ảnh tròn
                    }}
                    onClick={() =>
                      handleOpenImageModal(
                        `https://localhost:7138${user.imageUser}`
                      )
                    }
                  />
                )}

                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>{user.gender ? "Nam" : "Nữ"}</td>
                <td>{user.cccd}</td>
                <td>{user.roleName}</td>
                <td className="datetime-cell">
                  {user.registrationDate
                    ? new Date(user.registrationDate).toLocaleDateString(
                        "en-US"
                      )
                    : "-"}
                  <br />
                  <span className="time">
                    {user.registrationDate
                      ? new Date(user.registrationDate).toLocaleTimeString(
                          "en-US"
                        )
                      : ""}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* <button
                      style={{ marginBottom: "10px" }}
                      onClick={() => handleEdit(user)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "blue", fontSize: "2.0em" }}
                        className="btn-icon"
                      />
                    </button> */}
                    <button onClick={() => handleDelete(user.userId)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "red", fontSize: "2.0em" }}
                        className="btn-icon"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {!editingUser ? "Thêm mới nhân viên" : "Chỉnh sửa nhân viên"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {showPasswordFields && (
              <>
                <Form.Group controlId="formPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Nhập lại mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </>
            )}
            <Form.Group controlId="formImage">
              <Form.Label>Hình ảnh nhân viên</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>Họ và tên đệm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên đệm"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Giới tính</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCCCD">
              <Form.Label>Căn cước công dân</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập căn cước công dân"
                name="cccd"
                value={formData.cccd}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoleName">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                name="roleName"
                value={formData.roleName}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="Support">Support</option>
                <option value="Shipper">Shipper</option>
                <option value="Accountant">Accountant</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingUser ? (
            <Button variant="primary" onClick={handleAddUser}>
              Thêm nhân viên
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div className="pagination">
        <ul>{renderPageNumbers()}</ul>
      </div>
    </div>
  );
}

export default UserList;
