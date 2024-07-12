import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import NamImage from "../../../assets/Nam.jpg";
import NuImage from "../../../assets/Nu.jpg";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7138/api/User1/GetAllCustomer"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setWarningCount(user.warningCount);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedUser = { ...editingUser, warningCount };
      const response = await axios.put(
        `https://localhost:7138/api/User1/${updatedUser.userId}/update-warning-count`,
        updatedUser
      );
      if (response.status === 200) {
        setEditingUser(null);
        setShowModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7138/api/User1/${userId}`
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.userId !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
          Danh Sách Khách Hàng
        </h2>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Ảnh khách hàng</th>
              <th scope="col">Họ</th>
              <th scope="col">Tên</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Giới tính</th>
              <th scope="col">Căn cước công dân</th>
              <th scope="col">Vai trò</th>
              <th scope="col">Số lần cảnh cáo</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.email || "-"}</td>
                <td>
                  {user.imageUser ? (
                    <img
                      src={`https://localhost:7138${user.imageUser}`}
                      alt={user.title}
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        borderRadius: "50%", // Làm cho ảnh tròn
                      }}
                    />
                  ) : user.gender ? (
                    <img
                      src={NamImage}
                      alt="Nam"
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        borderRadius: "50%", // Làm cho ảnh tròn
                      }}
                    />
                  ) : (
                    <img
                      src={NuImage}
                      alt="Nữ"
                      style={{
                        maxWidth: "100px",
                        cursor: "pointer",
                        borderRadius: "50%", // Làm cho ảnh tròn
                      }}
                    />
                  )}
                </td>
                <td>{user.firstName || "-"}</td>
                <td>{user.lastName || "-"}</td>
                <td>{user.phoneNumber || "-"}</td>
                <td>{user.address || "-"}</td>
                <td>
                  {user.gender !== null && user.gender !== undefined
                    ? user.gender
                      ? "Nam"
                      : "Nữ"
                    : "-"}
                </td>
                <td>{user.cccd || "-"}</td>
                <td>{user.roleName || "-"}</td>
                <td>
                  {user.warningCount !== null && user.warningCount !== undefined
                    ? user.warningCount
                    : "-"}
                </td>
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
                    <button
                      style={{ marginBottom: "10px" }}
                      onClick={() => handleEdit(user)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "blue", fontSize: "2em" }}
                        className="btn-icon"
                      />
                    </button>
                    {/* <button onClick={() => handleDelete(user.userId)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "red", fontSize: "2em" }}
                        className="btn-icon"
                      />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Warning Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="warningCount">
              <Form.Label>Warning Count</Form.Label>
              <Form.Control
                type="number"
                value={warningCount}
                onChange={(e) => setWarningCount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pagination">
        <ul>
          {renderPageNumbers()}
        </ul>
      </div>
    </div>
  );
}

export default UserList;
