import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showModalImageUrl, setShowModalImageUrl] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    createdBy: "",
    updateBy: "", 
    imageFile: null, 
  });
  const [expandedPosts, setExpandedPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Post");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageUrl("");
    setShowModalImageUrl(false);
    setEditingPost(null);
    setFormData({
      title: "",
      content: "",
      createdBy: "",
      updateBy: "", // Xóa dữ liệu người cập nhật khi đóng modal
      imageFile: null, // Sửa tên trường này thành imageFile
    });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      createdBy: post.createdBy,
      updateBy: post.updateBy,
      imageFile: null, // Sửa tên trường này thành imageFile
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFormData({ ...formData, imageFile: imageFile }); // Sửa tên trường này thành imageFile
  };

  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("createdBy", formData.createdBy);
      formDataToSend.append("updateBy", formData.updateBy);
      formDataToSend.append("ImageFile", formData.imageFile); // Sửa tên trường này thành imageFile

      const response = await axios.put(
        `https://localhost:7138/api/Post/${editingPost.postId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        setEditingPost(null);
        fetchData();
        toast.success("Bài đăng đã được cập nhật thành công.", {
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
        console.error("Error updating post:", response.statusText);
        toast.error(
          "Có lỗi xảy ra khi cập nhật bài đăng. Vui lòng thử lại sau.",
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
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        "Có lỗi xảy ra khi cập nhật bài đăng. Vui lòng thử lại sau.",
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
    }
  };

  const handleAddPost = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("createdBy", formData.createdBy);
      formDataToSend.append("ImageFile", formData.imageFile); // Sửa tên trường này thành imageFile

      const response = await axios.post(
        "https://localhost:7138/api/Post",
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
          title: "",
          content: "",
          createdBy: "",
          updatedBy: "", // Xóa dữ liệu người cập nhật khi thêm mới
          imageFile: null, // Sửa tên trường này thành imageFile
        });
        fetchData();
        toast.success("Đã thêm một bài đăng mới!", {
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
        console.error("Error adding post:", response.statusText);
        toast.error(
          "Có lỗi xảy ra khi thêm bài đăng. Vui lòng thử lại sau.",
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
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error(
        "Có lỗi xảy ra khi thêm bài đăng. Vui lòng thử lại sau.",
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
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa bài đăng này không?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Post/${postId}`);
        setPosts(posts.filter((post) => post.postId !== postId));
        toast.success("Bài đăng đã được xóa thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error(
          "Có lỗi xảy ra khi xóa bài đăng. Vui lòng thử lại sau.",
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
      }
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowModalImageUrl(true);
  };

  const handleToggleExpanded = (postId) => {
    setExpandedPosts((prevExpandedPosts) =>
      prevExpandedPosts.includes(postId)
        ? prevExpandedPosts.filter((id) => id !== postId)
        : [...prevExpandedPosts, postId]
    );
  };

  return (
    <div className="table-wrapper">
      <div style={{marginTop: "-25px"}} className="container">
        <h2 style={{ textAlign: "center",display: "block" }} className="mt-4 mb-4">
          Danh Sách Bài Đăng
        </h2>
        <Button style={{ marginTop: "-50px" }} variant="success" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm mới bài đăng
        </Button>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Ảnh bài đăng</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Chỉnh sửa/Xóa</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.postId}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>
                  {expandedPosts.includes(post.postId)
                    ? post.content
                    : post.content.slice(0, 100)}
                  {post.content.length > 100 && (
                    <button
                      className="btn btn-link"
                      onClick={() => handleToggleExpanded(post.postId)}
                    >
                      {expandedPosts.includes(post.postId)
                        ? "Thu gọn"
                        : "Xem thêm"}
                    </button>
                  )}
                </td>
                <td>
                  {post.imageUrl && (
                    <img
                      src={`https://localhost:7138${post.imageUrl}`}
                      alt={post.title}
                      style={{ maxWidth: "100px", cursor: "pointer" }}
                      onClick={() =>
                        handleOpenImageModal(
                          `https://localhost:7138${post.imageUrl}`
                        )
                      }
                    />
                  )}
                </td>
                <td className="datetime-cell">
                  {post.createAt
                    ? new Date(post.createAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {post.createAt
                      ? new Date(post.createAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{post.createdBy || "-"}</td> */}
                <td className="datetime-cell">
                  {post.updateAt
                    ? new Date(post.updateAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {post.updateAt
                      ? new Date(post.updateAt).toLocaleTimeString("en-US")
                      : ""}
                  </span>
                </td>
                {/* <td>{post.updateBy || "-"}</td> */}
                <td style={{ textAlign: "center" }}>
                  <button style={{ marginRight: "10px" }} onClick={() => handleEdit(post)}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ color: "blue", fontSize: "2.0em" }}
                      className="btn-icon"
                    />
                  </button>
                  <button onClick={() => handleDelete(post.postId)}>
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
            {!editingPost ? "Thêm mới bài đăng" : "Chỉnh Sửa bài đăng"}
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
            {/* <Form.Group controlId="formCreatedBy">
              <Form.Label>Người tạo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người tạo"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
              />
            </Form.Group> */}
            {/* Hiển thị trường người cập nhật khi chỉnh sửa */}
            {/* {editingPost && (
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
            <Form.Group controlId="formImage">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                name="imageFile" // Sửa tên trường này thành imageFile
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingPost ? (
            <Button variant="primary" onClick={handleAddPost}>
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

export default PostList;
