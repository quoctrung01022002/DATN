import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BannerList() {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showModalImageUrl, setShowModalImageUrl] = useState(false); // Thêm trạng thái mới
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    sort: 0,
    isActive: false,
    createdBy: "",
    updatedBy: "",
    ImageFile: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Banner");
      setBanners(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách banner:", error);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      sort: banner.sort,
      isActive: banner.isActive,
      updatedBy: banner.updatedBy,
      ImageFile: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageUrl("");
    setShowModalImageUrl(false); // Đặt lại trạng thái modal xem ảnh chi tiết
    setEditingBanner(null);
    setFormData({
      title: "",
      sort: 0,
      isActive: false,
      createdBy: "",
      updatedBy: "",
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
    formDataToSend.append("sort", formData.sort);
    formDataToSend.append("isActive", formData.isActive);
    formDataToSend.append("updatedBy", formData.updatedBy);
    formDataToSend.append("ImageFile", formData.ImageFile);

    const response = await axios.put(
      `https://localhost:7138/api/Banner/${editingBanner.bannerId}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      setShowModal(false);
      setEditingBanner(null);
      fetchData();
      toast.success("Banner đã được cập nhật thành công.", {
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
      console.error("Error updating banner:", response.statusText);
      toast.error("Có lỗi xảy ra khi cập nhật banner. Vui lòng thử lại sau.", {
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
    toast.error("Có lỗi xảy ra khi cập nhật banner. Vui lòng thử lại sau.", {
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



  const handleAddBanner = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("sort", formData.sort);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("createdBy", formData.createdBy);
      formDataToSend.append("ImageFile", formData.ImageFile);
  
      const response = await axios.post(
        "https://localhost:7138/api/Banner",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        setShowModal(false); // Đóng modal sau khi thêm mới banner thành công
        // Đặt lại trạng thái formData về giá trị mặc định hoặc trạng thái ban đầu
        setFormData({
          title: "",
          sort: 0,
          isActive: false,
          createdBy: "",
          updatedBy: "",
          ImageFile: null,
        });
        fetchData(); // Tải lại danh sách banner
        toast.success("Đã thêm 1 Banner thành công !", {
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
        toast.error("Thêm Banner không thành công. Vui lòng thử lại sau.", {
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
          "Error adding banner:",
          response.data.error || response.statusText
        );
      }
    } catch (error) {
      toast.error("Thêm Banner không thành công. Vui lòng thử lại sau.");
      console.error("Error adding banner:", error);
    }
  };
  const handleDelete = async (bannerId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa banner này không?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Banner/${bannerId}`);
        setBanners(banners.filter((banner) => banner.bannerId !== bannerId));
      } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
      }
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowModalImageUrl(true);
  };

  return (
    <div className="table-wrapper">
      <div style={{marginTop: "-25px"}} className="container">
        <h2 style={{ textAlign: "center", display: "block" }} className="mt-4 mb-4">
          Danh Sách Banner
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm mới banner
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Ảnh banner</th>
              <th scope="col">Sắp xếp</th>
              <th scope="col">Hoạt động</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.bannerId}>
                <td>{index + 1}</td>
                <td>{banner.title}</td>
                <td>
                  {banner.imageUrl && (
                    <img
                      src={`https://localhost:7138${banner.imageUrl}`}
                      alt={banner.title}
                      style={{ maxWidth: "100px", cursor: "pointer" }}
                      onClick={() =>
                        handleOpenImageModal(
                          `https://localhost:7138${banner.imageUrl}`
                        )
                      }
                    />
                  )}
                </td>
                <td>{banner.sort}</td>
                <td>{banner.isActive ? "Có" : "Không"}</td>
                <td className="datetime-cell">
                  {banner.createdAt
                    ? new Date(banner.createdAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {banner.createdAt
                      ? new Date(banner.createdAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{banner.createdBy || "-"}</td> */}
                <td className="datetime-cell">
                  {banner.updatedAt
                    ? new Date(banner.updatedAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {banner.updatedAt
                      ? new Date(banner.updatedAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{banner.updatedBy || "-"}</td> */}
                <td style={{ textAlign: "center" }}>
                  <button style={{ marginRight: "10px" }} onClick={() => handleEdit(banner)}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ color: "blue", fontSize: "2.0em"}}
                      className="btn-icon"
                    />
                  </button>
                  <button onClick={() => handleDelete(banner.bannerId)}>
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
            {!editingBanner ? "Thêm mới Banner" : "Chỉnh Sửa Banner"}
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
            <Form.Group controlId="formImageUrl">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                name="ImageFile"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formSort">
              <Form.Label>Sắp xếp</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số sắp xếp"
                name="sort"
                value={formData.sort}
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
            {/* {!editingBanner ? (
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
                  name="updatedBy"
                  value={formData.updatedBy}
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
          {!editingBanner ? (
            <Button variant="primary" onClick={handleAddBanner}>
              Thêm mới
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSaveEdit}>
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalImageUrl}
        onHide={() => setShowModalImageUrl(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ảnh Chi Tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalImageUrl && (
            <img
              src={modalImageUrl}
              alt="Chi tiết ảnh"
              style={{ width: "100%" }}
            />
          )}
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
    </div>
  );
}

export default BannerList;
