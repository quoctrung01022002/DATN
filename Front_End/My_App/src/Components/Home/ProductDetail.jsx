import { useState, useEffect } from "react";
import axios from "axios";
import { FaCartPlus, FaReply, FaStar, FaStarHalfAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/ProductDetail.css";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";

const CustomProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State mới để lưu trữ ảnh được chọn
  const [starRating, setStarRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const cookies = new Cookies(null, { path: "/" });

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        if (!productId) return;

        const response = await axios.get(
          `https://localhost:7138/api/Product1/${productId}`
        );
        response.data.productImageDetails =
          response.data.productImageDetails.filter((image) => image.isActive);
        response.data.productImageDetails =
          response.data.productImageDetails.sort(
            (a, b) => a.position - b.position
          );
        setProduct(response.data);
        console.log(response.data.productImageDetails);
        if (
          response.data.productImageDetails &&
          response.data.productImageDetails.length > 0
        ) {
          const activeImages = response.data.productImageDetails.filter(
            (image) => image.isActive
          );
          if (activeImages.length > 0) {
            const sortedImages = activeImages.sort(
              (a, b) => a.position - b.position
            );
            setSelectedImage(sortedImages[0].imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    const fetchComments = async () => {
      try {
        if (!productId) return;

        const response = await axios.get(
          `https://localhost:7138/api/Comment/${productId}`
        );
        setComments(response.data);

        // Fetch average rating after fetching comments
        const averageRatingResponse = await axios.get(
          `https://localhost:7138/api/Comment/total-rating/${productId}`
        );
        setAverageRating(averageRatingResponse.data.averageRating);
        console.log("sadasd", averageRatingResponse);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProductDetail();
    fetchComments();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      if (quantity > product.quantity) {
        throw new Error("Số lượng yêu cầu vượt quá số lượng trong kho");
      }

      const accessToken = cookies.get("accessToken");

      if (!accessToken) {
        throw new Error("Bạn cần phải đăng nhập mới cho thêm vào giỏ hàng");
      }

      const response = await axios.post(
        "https://localhost:7138/api/Product/AddToCart",
        {
          productId: product.productId,
          quantity: quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Thêm vào giỏ hàng thành công", {
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
        throw new Error("Thêm vào giỏ hàng thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại", {
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

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value < 1 || isNaN(value)) {
      setQuantity();
    } else if (value >= product.quantity) {
      setQuantity(product.quantity);
    } else {
      setQuantity(value);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!newComment) return;

      const response = await axios.post(
        "https://localhost:7138/api/Comment",
        {
          productId: parseInt(productId),
          content: newComment,
          starRating: starRating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Thêm bình luận thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        const commentResponse = await axios.get(
          `https://localhost:7138/api/Comment/${productId}`
        );
        setComments(commentResponse.data);
        setNewComment("");
      } else {
        throw new Error("Thêm bình luận thất bại");
      }
    } catch (error) {
      if (error.response.status === 406) {
        toast.error("Bạn cần phải mua hàng cho đánh giá", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.response.status === 405) {
        toast.error("Bạn đã vị phạm từ cấm!", {
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
        toast.error("Bạn cần phải đăng nhập mới cho đánh giá", {
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
    }
  };

  const handleReplyToComment = async (commentId, replyContent) => {
    try {
      const response = await axios.post(
        "https://localhost:7138/api/Comment/addReply",
        {
          commentId: commentId,
          content: replyContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Trả lời thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const commentResponse = await axios.get(
          `https://localhost:7138/api/Comment/${productId}`
        );
        setComments(commentResponse.data);
        setNewReply("");
        setReplyingCommentId(null);
      } else {
        throw new Error("Trả lời bình luận thất bại");
      }
    } catch (error) {
      if (error.response.status === 405) {
        toast.error("Bạn đã vị phạm từ cấm!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      // } else if (error.response.status === 405) {
      //   toast.error("Bạn đã vị phạm từ cấm!", {
      //     position: "top-right",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "colored",
      //   });
      } else {
        toast.error("Bạn cần phải đăng nhập mới cho trả lời", {
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
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmation = window.confirm(
        "Bạn có chắc chắn muốn xóa bình luận này không?"
      );
      if (!confirmation) return;

      const response = await axios.delete(
        `https://localhost:7138/api/Comment/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Xóa bình luận thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const commentResponse = await axios.get(
          `https://localhost:7138/api/Comment/${productId}`
        );
        setComments(commentResponse.data);
      } else {
        throw new Error("Xóa bình luận thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Xóa bình luận thất bại", {
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

  const handleDeleteReply = async (replyId) => {
    try {
      const confirmation = window.confirm(
        "Bạn có chắc chắn muốn xóa phản hồi này không?"
      );
      if (!confirmation) return;

      const response = await axios.delete(
        `https://localhost:7138/api/Comment/reply/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Xóa phản hồi thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const commentResponse = await axios.get(
          `https://localhost:7138/api/Comment/${productId}`
        );
        setComments(commentResponse.data);
      } else {
        throw new Error("Xóa phản hồi thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Xóa phản hồi thất bại", {
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

  const renderAddButton = () => {
    if (quantity >= product.quantity) {
      return (
        <button className="quantity-btn" disabled>
          +
        </button>
      );
    } else {
      return (
        <button
          style={{
            width: "30px",
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
          className="quantity-btn"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      );
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            {/* Card header */}
            {product.discountValue !== 0 && (
              <div className="card-header">
                {product.discountValue * 100}% OFF
              </div>
            )}
            <div className="card-body">
              {/* New product indicator */}
              <div className="text-center">
                <h6>
                  Đánh giá trung bình:{" "}
                  {[...Array(5)].map((_, index) => {
                    const rating = averageRating - index;
                    return (
                      <span
                        key={index}
                        style={{ marginLeft: "2px", marginRight: "2px" }}
                      >
                        {rating >= 1 ? (
                          <FaStar style={{ color: "#ffc107" }} />
                        ) : rating > 0 ? (
                          <FaStarHalfAlt style={{ color: "#ffc107" }} />
                        ) : (
                          <FaStar style={{ color: "#e4e5e9" }} />
                        )}
                      </span>
                    );
                  })}
                  {averageRating.toFixed(1)}/5
                </h6>
              </div>
              {product.isNew && (
                <p
                  style={{
                    backgroundColor: "#ffcccc",
                    color: "#333",
                    display: "inline-block",
                    padding: "2px 4px", // Thêm padding nếu muốn
                    borderRadius: "4px", // Tùy chọn: thêm bo tròn góc
                  }}
                  className="card-text"
                >
                  Mới
                </p>
              )}

              {selectedImage && (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <img
                    style={{ maxWidth: "400%",marginBottom:"10px" }}
                    src={`https://localhost:7138${selectedImage}`}
                    alt="Selected Image"
                    className="img-thumbnail"
                  />
                </div>
              )}

              <div className="col-md-12">
                <h2>Ảnh sản phẩm</h2>
                <div className="row">
                  {product &&
                    product.productImageDetails.map((imageDetail, index) => (
                      <div
                        key={index}
                        className="col-md-3"
                        onClick={() => handleImageClick(imageDetail.imageUrl)}
                      >
                        <img
                          style={{ maxWidth: "50px" }}
                          src={`https://localhost:7138${imageDetail.imageUrl}`}
                          alt={`Ảnh ${index + 1}`}
                          className="img-thumbnail"
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* Product name */}
              <h5 className="card-title">{product.productName}</h5>
              {/* Product price */}
              <p className="card-text">
                {product.discountValue === 0 ? (
                  <span>{product.price.toLocaleString("vi-VN")}₫</span>
                ) : (
                  <>
                    <span className="text-decoration-line-through">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="ml-2">
                      {(
                        product.price -
                        product.price * product.discountValue
                      ).toLocaleString("vi-VN")}
                      ₫
                    </span>
                  </>
                )}
                /{product.unit}
              </p>
              <p className="card-text">Nhà sản xuất: {product.manufacturer}</p>
              <p className="card-text">
                Thương hiệu: {product.countryOfOrigin}
              </p>
              <p className="card-text">Mô tả: {product.description}</p>
              <p className="card-text">
                Ghi chú đặc biệt: {product.specialNote}
              </p>
              <p className="card-text">
                Số lượng hiện tại trong kho: {product.quantity}
              </p>
              <label>Số lượng:</label>
              <div className="input-group mb-3">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                {renderAddButton()}
              </div>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <FaCartPlus /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        {/* Comment section */}
        <div className="col-md-8">
          <h2>Bình luận</h2>
          <div
            className="comment-section"
            style={{ maxHeight: "1350px", overflowY: "auto" }}
          >
            {/* Input for new comment */}
            <input
              className="form-control mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <span>Đánh giá: </span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <FaStar
                  key={rating}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: rating <= starRating ? "#ffc107" : "#e4e5e9",
                  }}
                  onClick={() => setStarRating(rating)}
                />
              ))}
            </div>
            <button className="btn btn-primary mb-3" onClick={handleAddComment}>
              Thêm bình luận
            </button>
            {comments.map((comment, index) => (
              <div key={index} className="mb-3 border p-3">
                <p>{comment.content}</p>
                <div>
                  {[...Array(comment.starRating)].map((_, index) => (
                    <FaStar key={index} style={{ color: "#ffc107" }} />
                  ))}
                </div>
                <p>{new Date(comment.commentDate).toLocaleString()}</p>
                <p>
                  Bình luận bởi: {comment.firstName} {comment.lastName}
                </p>
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => handleDeleteComment(comment.commentId)}
                  style={{ marginRight: "10px" }}
                >
                  Xóa
                </button>
                {replyingCommentId === comment.commentId ? (
                  <div className="mt-3">
                    <input
                      className="form-control mb-2"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Nhập phản hồi của bạn..."
                    />
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() =>
                        handleReplyToComment(comment.commentId, newReply)
                      }
                    >
                      Gửi
                    </button>
                  </div>
                ) : (
                  <button
                    style={{ marginTop: "10px" }}
                    className="btn btn-secondary mb-2"
                    onClick={() => setReplyingCommentId(comment.commentId)}
                  >
                    <FaReply /> Trả lời
                  </button>
                )}
                {comment.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className="mb-2 border p-3">
                    <p>{reply.content}</p>
                    <p>
                      {reply.replyDate
                        ? new Date(reply.replyDate).toLocaleString()
                        : "-"}
                    </p>
                    <p>
                      Phản hồi bởi: {reply.firstName} {reply.lastName}
                    </p>
                    <button
                      className="btn btn-danger mr-2"
                      onClick={() => handleDeleteReply(reply.replyId)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomProductDetail;
