import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    address: "",
    phoneNumber: "",
    contactEmail: "",
    contactPerson: "",
    createdBy: "",
    updateBy: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Supplier");
      setSuppliers(response.data);
      console.log("asdsa", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName,
      address: supplier.address || "",
      phoneNumber: supplier.phoneNumber || "",
      contactEmail: supplier.contactEmail || "",
      contactPerson: supplier.contactPerson || "",
      createdBy: supplier.createdBy || "",
      updateBy: supplier.updateBy || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({
      supplierName: "",
      address: "",
      phoneNumber: "",
      contactEmail: "",
      contactPerson: "",
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

  const handleAddSupplier = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Supplier",
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          supplierName: "",
          address: "",
          phoneNumber: "",
          contactEmail: "",
          contactPerson: "",
          createdBy: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Đã thêm nhà cung cấp thành công !", {
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
          "Thêm nhà cung cấp không thành công. Vui lòng thử lại sau.",
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
          "Error adding supplier:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Thêm nhà cung cấp không thành công. Vui lòng thử lại sau.");
      console.error("Error adding supplier:", error);
    }
  };

  const handleDelete = async (supplierId) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa nhà cung cấp này không?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Supplier/${supplierId}`);
        setSuppliers(
          suppliers.filter((supplier) => supplier.supplierId !== supplierId)
        );
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7138/api/Supplier/${editingSupplier.supplierId}`,
        formData
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          supplierName: "",
          address: "",
          phoneNumber: "",
          contactEmail: "",
          contactPerson: "",
          updateBy: "",
        });
        fetchData();
        toast.success("Đã cập nhật nhà cung cấp thành công !", {
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
          "Cập nhật nhà cung cấp không thành công. Vui lòng thử lại sau.",
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
          "Error updating supplier:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error(
        "Cập nhật nhà cung cấp không thành công. Vui lòng thử lại sau."
      );
      console.error("Error updating supplier:", error);
    }
  };

  return (
    <div className="table-wrapper">
      <div style={{ marginTop: "-25px" }} className="container">
        <h2
          style={{ textAlign: "center", display: "block" }}
          className="mt-4 mb-4"
        >
          Danh Sách Nhà Cung Cấp
        </h2>
        <Button
          style={{ marginTop: "-50px" }}
          variant="success"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm mới nhà cung cấp
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên nhà cung cấp</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Email liên hệ</th>
              <th scope="col">Người liên hệ</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.supplierId}>
                <td>{index + 1}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.address || "-"}</td>
                <td>{supplier.phoneNumber || "-"}</td>
                <td>{supplier.contactEmail || "-"}</td>
                <td>{supplier.contactPerson || "-"}</td>
                <td className="datetime-cell">
                  {supplier.createAt
                    ? new Date(supplier.createAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {supplier.createAt
                      ? new Date(supplier.createAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{supplier.createdBy || "-"}</td> */}
                <td className="datetime-cell">
                  {supplier.updateAt
                    ? new Date(supplier.updateAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {supplier.updateAt
                      ? new Date(supplier.updateAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{supplier.updateBy || "-"}</td> */}
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
                      onClick={() => handleEdit(supplier)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "blue", fontSize: "2.0em" }}
                        className="btn-icon"
                      />
                    </button>
                    <button onClick={() => handleDelete(supplier.supplierId)}>
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
            {!editingSupplier
              ? "Thêm mới nhà cung cấp"
              : "Chỉnh Sửa nhà cung cấp"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSupplierName">
              <Form.Label>Tên nhà cung cấp</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên nhà cung cấp"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
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
              />
            </Form.Group>
            <Form.Group controlId="formContactEmail">
              <Form.Label>Email liên hệ</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email liên hệ"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formContactPerson">
              <Form.Label>Người liên hệ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người liên hệ"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* {!editingSupplier ? (
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
                <Form.Group controlId="formUpdateBy">
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
          {!editingSupplier ? (
            <Button variant="primary" onClick={handleAddSupplier}>
              Thêm mới
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Supplier;
