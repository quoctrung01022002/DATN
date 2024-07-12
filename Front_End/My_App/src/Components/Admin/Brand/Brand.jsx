import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Brand() {
  const [brandDetails, setBrandDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBrandDetail, setEditingBrandDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    countryOfOrigin: "",
    createdBy: "",
    updateBy: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Brand");
      setBrandDetails(response.data);
    } catch (error) {
      console.error("Error fetching brand details:", error);
    }
  };

  const handleEdit = (brandDetail) => {
    setEditingBrandDetail(brandDetail);
    setFormData({
      countryOfOrigin: brandDetail.countryOfOrigin || "",
      createdBy: brandDetail.createdBy || "",
      updateBy: brandDetail.updateBy || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrandDetail(null);
    setFormData({
      countryOfOrigin: "",
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

  const handleAddBrandDetail = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Brand",
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          countryOfOrigin: "",
          createdBy: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Successfully added a brand detail!", {
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
        toast.error("Failed to add brand detail. Please try again later.", {
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
          "Error adding brand detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to add brand detail. Please try again later.");
      console.error("Error adding brand detail:", error);
    }
  };

  const handleDelete = async (brandId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this brand detail?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Brand/${brandId}`);
        setBrandDetails(
          brandDetails.filter((detail) => detail.brandId !== brandId)
        );
      } catch (error) {
        console.error("Error deleting brand detail:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7138/api/Brand/${editingBrandDetail.brandId}`,
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          countryOfOrigin: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Successfully updated brand detail!", {
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
          "Failed to update brand detail. Please try again later.",
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
          "Error updating brand detail:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to update brand detail. Please try again later.");
      console.error("Error updating brand detail:", error);
    }
  };
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = brandDetails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(brandDetails.length / itemsPerPage);

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
        <h2 style={{ textAlign: "center", display: "block"  }} className="mt-4 mb-4">
          Danh Sách Thương Hiệu
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm mới thương hiệu
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên thương hiệu</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((detail, index) => (
              <tr key={detail.brandId}>
                <td>{index + 1}</td>
                <td>{detail.countryOfOrigin || "-"}</td>
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
                  <button onClick={() => handleDelete(detail.brandId)}>
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
            {!editingBrandDetail ? "Add New Brand" : "Edit Brand"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCountryOfOrigin">
              <Form.Label>Tên thương hiệu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên thương hiệu"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* {!editingBrandDetail ? (
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
            Close
          </Button>
          {!editingBrandDetail ? (
            <Button variant="primary" onClick={handleAddBrandDetail}>
              Add New
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

export default Brand;
