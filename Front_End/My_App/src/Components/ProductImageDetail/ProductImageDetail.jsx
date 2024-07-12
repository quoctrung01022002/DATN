import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faCaretDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../css/ProductImageDetail.css';

function ProductImageDetail() {
  const [productImageDetails, setProductImageDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProductImageDetail, setEditingProductImageDetail] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    imageUrl: "",
    position: 0,
    isActive: false,
    createdBy: "",
    updatedBy: "",
    ImageFile: null,
  });
  const [productIds, setProductIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State mới để hiển thị modal xem ảnh chi tiết
  const [showModalImageUrl, setShowModalImageUrl] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState(""); // Thêm state mới để lưu URL ảnh modal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Product1");
      setProductIds(response.data);
      const imageDetailsResponse = await axios.get("https://localhost:7138/api/ProductImageDetail");
      setProductImageDetails(imageDetailsResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ProductImageDetail:", error);
    }
  };

  const handleShowImageModal = (imageUrl) => {
    setImageModalUrl(imageUrl);
    setShowModalImageUrl(true);
  };

  const handleEdit = (productImageDetail) => {
    setEditingProductImageDetail(productImageDetail);
    setFormData({
      productId: productImageDetail.productId,
      productName: productImageDetail.productName,
      imageUrl: productImageDetail.imageUrl,
      position: productImageDetail.position,
      isActive: productImageDetail.isActive,
      createdBy: productImageDetail.createdBy,
      updatedBy: productImageDetail.updatedBy,
      ImageFile: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProductImageDetail(null);
    setFormData({
      productId: "",
      productName: "",
      imageUrl: "",
      position: 0,
      isActive: false,
      createdBy: "",
      updatedBy: "",
      ImageFile: null,
    });
    // Đặt lại state của modal xem ảnh về false khi đóng modal
    setShowModalImageUrl(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFormData({ ...formData, ImageFile: imageFile });
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({ ...formData, productId: product.productId, productName: product.productName });
    setShowDropdown(false);
  };

  const handleAddProductImageDetail = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productId", formData.productId);
      formDataToSend.append("imageUrl", formData.imageUrl);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("createdBy", formData.createdBy);
      formDataToSend.append("ImageFile", formData.ImageFile);

      const response = await axios.post(
        "https://localhost:7138/api/ProductImageDetail",
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
          productId: "",
          productName: "",
          imageUrl: "",
          position: 0,
          isActive: false,
          createdBy: "",
          updatedBy: "",
          ImageFile: null,
        });
        fetchData();
        toast.success("Đã thêm 1 Product image detail thành công !", {
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
        toast.error("Thêm Product image detail không thành công. Vui lòng thử lại sau.", {
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
          "Error adding product image detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Thêm Product image detail không thành công. Vui lòng thử lại sau.");
      console.error("Error adding product image detail:", error);
    }
  };

  const handleDelete = async (productImageId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa product image detail này không?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/ProductImageDetail/${productImageId}`);
        setProductImageDetails(productImageDetails.filter((detail) => detail.productImageId !== productImageId));
      } catch (error) {
        console.error("Lỗi khi xóa product image detail:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productId", formData.productId);
      formDataToSend.append("imageUrl", formData.imageUrl);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("updateBy", formData.updateBy);

      const response = await axios.put(
        `https://localhost:7138/api/ProductImageDetail/${editingProductImageDetail.productImageId}`,
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
          productId: "",
          productName: "",
          imageUrl: "",
          position: 0,
          isActive: false,
          createdBy: "",
          updatedBy: "",
          ImageFile: null,
        });
        fetchData();
        toast.success("Đã cập nhật ảnh sản phẩm chi tiết thành công !", {
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
        toast.error("Cập nhật ảnh sản phẩm chi tiết không thành công. Vui lòng thử lại sau.", {
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
          "Error updating product image detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Cập nhật ảnh sản phẩm chi tiết không thành công. Vui lòng thử lại sau.");
      console.error("Error updating product image detail:", error);
    }
  };

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productImageDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productImageDetails.length / itemsPerPage);

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
          Danh Sách Sản Phẩm Chi Tiết
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm mới chi tiết hình ảnh sản phẩm
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ảnh chi tiết</th>
              <th scope="col">Vị trí</th>
              <th scope="col">Hoạt động</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((detail, index) => (
              <tr key={detail.productImageId}>
                <td>{index + 1}</td>
                <td>
                  {detail.imageUrl && (
                    <img
                      src={`https://localhost:7138${detail.imageUrl}`}
                      alt={detail.productId}
                      style={{ maxWidth: "100px", cursor: "pointer" }}
                      onClick={() => handleShowImageModal(`https://localhost:7138${detail.imageUrl}`)}
                    />
                  )}
                </td>
                <td>{detail.position}</td>
                <td>{detail.isActive ? "Có" : "Không"}</td>
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
                  <button onClick={() => handleDelete(detail.productImageId)}>
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
            {!editingProductImageDetail ? "Thêm mới Product Image Detail" : "Chỉnh Sửa Product Image Detail"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductId">
              <Form.Label>Danh sách tên sản phẩm</Form.Label>
              <div className="dropdown">
                <Form.Control
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onClick={handleDropdownClick}
                  placeholder="Chọn tên sản phẩm"
                  readOnly
                />
                <div className={`dropdown-menu${showDropdown ? " show" : ""}`}>
                  {productIds.map((product) => (
                    <button
                      key={product.productId}
                      className="dropdown-item"
                      type="button"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.productName}
                    </button>
                  ))}
                </div>
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={handleDropdownClick}>
                    <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                </div>
              </div>
            </Form.Group>
            <Form.Group controlId="formImageUrl">
              <Form.Label>Hình ảnh chi tiết sản phẩm</Form.Label>
              <Form.Control
                type="file"
                name="ImageFile"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formPosition">
              <Form.Label>Vị trí</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số vị trí"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIsActive">
              <Form.Check
                type="checkbox"
                label="Hoạt động"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            </Form.Group>
            {/* <Form.Group controlId={editingProductImageDetail ? "formUpdatedBy" : "formCreatedBy"}>
              <Form.Label>{!editingProductImageDetail ? "Người tạo" : "Người cập nhật"}</Form.Label>
              <Form.Control
                type="text"
                placeholder={!editingProductImageDetail ? "Nhập tên người tạo" : "Nhập tên người cập nhật"}
                name={!editingProductImageDetail ? "createdBy" : "updateBy"}
                value={!editingProductImageDetail ? formData.createdBy : formData.updateBy}
                onChange={handleInputChange}
              />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingProductImageDetail ? (
            <Button variant="primary" onClick={handleAddProductImageDetail}>
              Thêm mới
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showModalImageUrl} onHide={() => setShowModalImageUrl(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ảnh chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageModalUrl} alt="Ảnh chi tiết" style={{ maxWidth: "100%" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalImageUrl(false)}
          >
            Đóng
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

export default ProductImageDetail;
