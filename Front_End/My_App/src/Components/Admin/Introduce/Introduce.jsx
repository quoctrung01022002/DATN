import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function IntroduceList() {
  const [introduces, setIntroduces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showModalImageUrl, setShowModalImageUrl] = useState(false); // New state
  const [editingIntroduce, setEditingIntroduce] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isActive: false,
    ImageFile: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Introduce");
      setIntroduces(response.data);
    } catch (error) {
      console.error("Error fetching introduces:", error);
    }
  };

  const handleEdit = (introduce) => {
    setEditingIntroduce(introduce);
    setFormData({
      title: introduce.title,
      content: introduce.content,
      isActive: introduce.isActive,
      ImageFile: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageUrl("");
    setShowModalImageUrl(false); // Reset image modal state
    setEditingIntroduce(null);
    setFormData({
      title: "",
      content: "",
      isActive: false,
      ImageFile: null,
    });
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("ImageFile", formData.ImageFile);

      const response = await axios.put(
        `https://localhost:7138/api/Introduce/${editingIntroduce.introduceId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        setEditingIntroduce(null);
        fetchData();
        toast.success("Introduce updated successfully.", {
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
        console.error("Error updating introduce:", response.statusText);
        toast.error("Failed to update introduce. Please try again later.", {
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
      toast.error("Failed to update introduce. Please try again later.", {
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

  const handleAddIntroduce = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("ImageFile", formData.ImageFile);

      const response = await axios.post(
        "https://localhost:7138/api/Introduce",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setShowModal(false);
        setFormData({
          title: "",
          content: "",
          isActive: false,
          ImageFile: null,
        });
        fetchData();
        toast.success("Introduce added successfully!", {
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
        toast.error("Failed to add introduce. Please try again later.", {
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
          "Error adding introduce:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to add introduce. Please try again later.");
      console.error("Error adding introduce:", error);
    }
  };

  const handleDelete = async (introduceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this introduce?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://localhost:7138/api/Introduce/${introduceId}`
        );
        setIntroduces(
          introduces.filter(
            (introduce) => introduce.introduceId !== introduceId
          )
        );
      } catch (error) {
        console.error("Error deleting introduce:", error);
      }
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowModalImageUrl(true);
  };

  return (
    <div className="table-wrapper">
      <div style={{ marginTop: "-25px" }} className="container">
        <h2
          style={{ textAlign: "center", display: "block" }}
          className="mt-4 mb-4"
        >
          Giới Thiệu
        </h2>
        <Button
          style={{ marginTop: "-50px" }}
          variant="success"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm mới giới thiệu
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Hoạt động</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Ngày cập nhật</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {introduces.map((introduce, index) => (
              <tr key={introduce.introduceId}>
                <td>{index + 1}</td>
                <td>{introduce.title}</td>
                <td>{introduce.content}</td>
                <td>
                  {introduce.imageUrl && (
                    <img
                      src={`https://localhost:7138${introduce.imageUrl}`}
                      alt={introduce.title}
                      style={{ maxWidth: "100px", cursor: "pointer" }}
                      onClick={() =>
                        handleOpenImageModal(
                          `https://localhost:7138${introduce.imageUrl}`
                        )
                      }
                    />
                  )}
                </td>
                <td>{introduce.isActive ? "Có" : "Không"}</td>
                <td className="datetime-cell">
                  {introduce.createdAt
                    ? new Date(introduce.createdAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {introduce.createdAt
                      ? new Date(introduce.createdAt).toLocaleTimeString(
                          "en-US"
                        )
                      : ""}
                  </span>
                </td>
                <td className="datetime-cell">
                  {introduce.updatedAt
                    ? new Date(introduce.updatedAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {introduce.updatedAt
                      ? new Date(introduce.updatedAt).toLocaleTimeString(
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
                      onClick={() => handleEdit(introduce)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: "blue", fontSize: "2.0em" }}
                        className="btn-icon"
                      />
                    </button>
                    <button onClick={() => handleDelete(introduce.introduceId)}>
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
            {!editingIntroduce ? "Thêm mới phần giới thiệu" : "Chỉnh sửa phần giới thiệu"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formContent">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập nội dung"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Hình ảnh giới thiệu</Form.Label>
              <Form.Control
                type="file"
                name="ImageFile"
                onChange={handleImageChange}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingIntroduce ? (
            <Button variant="primary" onClick={handleAddIntroduce}>
              Thêm
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalImageUrl}
        onHide={() => setShowModalImageUrl(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalImageUrl && (
            <img
              src={modalImageUrl}
              alt="Image Detail"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalImageUrl(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default IntroduceList;
