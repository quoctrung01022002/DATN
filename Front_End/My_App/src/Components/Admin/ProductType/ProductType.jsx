import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductType() {
  const [productTypeDetails, setProductTypeDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProductTypeDetail, setEditingProductTypeDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    productTypeName: "",
    description: "",
    createdBy: "",
    updateBy: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/ProductType");
      setProductTypeDetails(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ProductType:", error);
    }
  };

  const handleEdit = (productTypeDetail) => {
    setEditingProductTypeDetail(productTypeDetail);
    setFormData({
      productTypeName: productTypeDetail.productTypeName,
      description: productTypeDetail.description || "",
      createdBy: productTypeDetail.createdBy || "",
      updateBy: productTypeDetail.updateBy || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProductTypeDetail(null);
    setFormData({
      productTypeName: "",
      description: "",
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

  const handleAddProductTypeDetail = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7138/api/ProductType",
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          productTypeName: "",
          description: "",
          createdBy: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Đã thêm 1 Product type detail thành công !", {
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
        toast.error("Thêm Product type detail không thành công. Vui lòng thử lại sau.", {
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
          "Error adding product type detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Thêm Product type detail không thành công. Vui lòng thử lại sau.");
      console.error("Error adding product type detail:", error);
    }
  };

  const handleDelete = async (productTypeId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa product type detail này không?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/ProductType/${productTypeId}`);
        setProductTypeDetails(productTypeDetails.filter((detail) => detail.productTypeId !== productTypeId));
      } catch (error) {
        console.error("Lỗi khi xóa product type detail:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7138/api/ProductType/${editingProductTypeDetail.productTypeId}`,
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          productTypeName: "",
          description: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Đã cập nhật product type detail thành công !", {
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
        toast.error("Cập nhật product type detail không thành công. Vui lòng thử lại sau.", {
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
          "Error updating product type detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Cập nhật product type detail không thành công. Vui lòng thử lại sau.");
      console.error("Error updating product type detail:", error);
    }
  };
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productTypeDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productTypeDetails.length / itemsPerPage);

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
          Danh Sách Danh Mục
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm mới loại sản phẩm
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên loại sản phẩm</th>
              {/* <th scope="col">Mô tả</th> */}
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((detail, index) => (
              <tr key={detail.productTypeId}>
                <td>{index + 1}</td>
                <td>{detail.productTypeName}</td>
                {/* <td>{detail.description || "-"}</td> */}
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
                  <button onClick={() => handleDelete(detail.productTypeId)}>
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
            {!editingProductTypeDetail ? "Thêm mới loại sản phẩm" : "Chỉnh Sửa loại sản phẩm"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductTypeName">
              <Form.Label>Tên loại sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên loại sản phẩm"  
                name="productTypeName"
                value={formData.productTypeName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* {!editingProductTypeDetail ? (
              <Form.Group controlId="formCreatedBy">
                <Form.Label>Người tạo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên người tạo"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleInputChange}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="formUpdatedBy">
                <Form.Label>Người cập nhật</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên người cập nhật"
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
          {!editingProductTypeDetail ? (
            <Button variant="primary" onClick={handleAddProductTypeDetail}>
              Thêm mới
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Lưu
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

export default ProductType;
