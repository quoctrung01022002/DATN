import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Discount() {
  const [discountDetails, setDiscountDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscountDetail, setEditingDiscountDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    discountValue: "",
    createdBy: "",
    updateBy: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Discount");
      setDiscountDetails(response.data);
    } catch (error) {
      console.error("Error fetching discount details:", error);
    }
  };

  const handleEdit = (discountDetail) => {
    setEditingDiscountDetail(discountDetail);
    setFormData({
      discountValue: (discountDetail.discountValue * 100).toString(), // Chuyển đổi giá trị sang phần trăm
      createdBy: discountDetail.createdBy || "",
      updateBy: discountDetail.updateBy || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiscountDetail(null);
    setFormData({
      discountValue: "",
      createdBy: "",
      updateBy: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddDiscountDetail = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Discount",
        {
          ...formData,
          discountValue: (parseFloat(formData.discountValue) / 100).toFixed(0),
        } // Chuyển đổi giá trị từ phần trăm thành số thập phân và làm tròn số
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          discountValue: "",
          createdBy: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Successfully added a discount detail!", {
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
        toast.error("Failed to add discount detail. Please try again later.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.error(
          "Error adding discount detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to add discount detail. Please try again later.");
      console.error("Error adding discount detail:", error);
    }
  };

  const handleDelete = async (discountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this discount detail?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Discount/${discountId}`);
        setDiscountDetails(
          discountDetails.filter((detail) => detail.discountId !== discountId)
        );
      } catch (error) {
        console.error("Error deleting discount detail:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7138/api/Discount/${editingDiscountDetail.discountId}`,
        {
          ...formData,
          discountValue: (parseFloat(formData.discountValue) / 100).toFixed(0),
        } // Chuyển đổi giá trị từ phần trăm thành số thập phân và làm tròn số
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          discountValue: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Successfully updated discount detail!", {
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
        toast.error(
          "Failed to update discount detail. Please try again later.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );

        console.error(
          "Error updating discount detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to update discount detail. Please try again later.");
      console.error("Error updating discount detail:", error);
    }
  };
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = discountDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(discountDetails.length / itemsPerPage);

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
      <div style={{marginTop: "-25px"}} className="container">
        <h2 style={{ textAlign: "center",display: "block" }} className="mt-4 mb-4">
          Danh Sách Giảm Giá
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm giảm giá mới
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Giá trị giảm giá</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((detail, index) => (
              <tr key={detail.discountId}>
                <td>{index + 1}</td>
                <td>
                  {(parseFloat(detail.discountValue) * 100).toFixed(0)}%
                </td>{" "}
                {/* Chuyển đổi giá trị từ số thập phân sang phần trăm và làm tròn số */}
                <td className="datetime-cell">
                  {detail.createAt
                    ? new Date(detail.createAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {detail.createAt
                      ? new Date(detail.createAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{detail.createdBy || "-"}</td> */}
                <td className="datetime-cell">
                  {detail.updateAt
                    ? new Date(detail.updateAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {detail.updateAt
                      ? new Date(detail.updateAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{detail.updateBy || "-"}</td> */}
                <td style={{ textAlign: "center" }}>
                  <button style={{ marginRight: "10px" }} onClick={() => handleEdit(detail)}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ color: "blue", fontSize: "2.0em" }}
                      className="btn-icon"
                    />
                  </button>
                  <button onClick={() => handleDelete(detail.discountId)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "red", fontSize: "2.0em" }}
                      className="btn-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {!editingDiscountDetail ? "Thêm mới giảm giá" : "chỉnh sửa giảm giá"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDiscountValue">
              <Form.Label>Giá trị giảm giá (%)</Form.Label>{" "}
              {/* Đặt nhãn cho input */}
              <Form.Control
                type="number"
                placeholder="Nhập giá trị giảm giá"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* {!editingDiscountDetail ? (
              <Form.Group controlId="formCreatedBy">
                <Form.Label>Created By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter created by"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="formUpdatedBy">
                <Form.Label>Updated By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter updated by"
                  name="updateBy"
                  value={formData.updateBy}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )} */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingDiscountDetail ? (
            <Button variant="primary" onClick={handleAddDiscountDetail}>
              Thêm mới
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          )}
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

export default Discount;
