import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import { FaCartPlus, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import "../../css/Home.css";
import { useSpring, animated } from "react-spring";

const YourComponent = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const cookies = new Cookies(null, { path: "/" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchBanners();
  }, []);

  useEffect(() => {
    const startIdx = currentIndex * 4;
    const endIdx = Math.min(startIdx + 4, products.length);
    const filteredProducts = products.filter(
      (product) =>
        product.discountId !== 13 &&
        product.discountValue !== undefined &&
        product.discountValue !== 0
    );
    setVisibleProducts(filteredProducts.slice(startIdx, endIdx));
  }, [currentIndex, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7138/api/Product1/product-requests"
      );
      setProducts(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Banner");
      const sortedBanners = response.data
        .filter((banner) => banner.isActive)
        .sort((a, b) => a.Sort - b.Sort);
      setBanners(sortedBanners);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const accessToken = cookies.get("accessToken");
      if (!accessToken) {
        toast.error("Bạn cần phải đăng nhập mới thêm vào giỏ hàng!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
  
      await axios.post(
        "https://localhost:7138/api/Product/AddToCart",
        {
          productId: productId,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      toast.success("Thêm vào giỏ hàng thành công!", { theme: "colored" });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 402) {
          toast.error("Số lượng yêu cầu vượt quá số lượng trong kho", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else if (error.response.status === 403) {
          toast.error("Bạn không có quyền thực hiện hành động này", {
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
          toast.error("Đã xảy ra lỗi! Vui lòng thử lại.", {
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
      } else {
        toast.error("Bạn cần phải đăng nhập mới thêm vào giỏ hàng!", {
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
  

  const handleProductDetailClick = async (productId) => {
    try {
      const response = await axios.get(
        `https://localhost:7138/api/Product1/${productId}`
      );
      const productDetail = response.data;
      navigate(`/productdetail/${productId}`, { state: { productDetail } });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextSlide = () => {
    const maxIndex = Math.ceil(products.length / 4) - 1;
    if (currentIndex < maxIndex) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleError = (error) => {
    setError(error.message);
    toast.error(error.message, { theme: "colored" });
  };
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div className="introduction-page" style={fadeIn}>
      <div className="total-container">
        <Carousel interval={3000} pause={false} indicators={false}>
          {banners.map((banner, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 h-100"
                src={`https://localhost:7138${banner.imageUrl}`}
                alt={`Slide ${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="offer-container">
          <h2 style={{display: "block"}} className="offer-title text-center font-weight-bold p-3 bg-light border">
            Ưu đãi trong tuần
          </h2>
          <div className="product-carousel">
            <div className="banner-carousel">
              <button onClick={prevSlide} className="carousel-btn prev-btn">
                &#60;
              </button>
              <button onClick={nextSlide} className="carousel-btn next-btn">
                &#62;
              </button>
            </div>
            <div className="row mb-4">
  {visibleProducts.map((product, index) => (
    <div
      key={index}
      className="col-lg-3 col-md-3 col-sm-6 col-12 mb-4"
    >
      <div className="card">
        <p
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            backgroundColor: "#ffc107",
            color: "#333",
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
            zIndex: 1,
          }}
          className="product-discount"
        >
          {product.discountValue * 100}%
        </p>
        {product.isNew && (
          <p
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "#ffcccc",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold",
              zIndex: 1,
              display: "flex",
              justifyContent: "center", // Căn giữa theo chiều ngang
              alignItems: "center", // Căn giữa theo chiều dọc
            }}
            className="product-isnew"
          >
            Mới
          </p>
        )}
        <img
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            marginTop: "40px", // Đẩy hình ảnh xuống 40px
          }}
          src={
            product.productImage
              ? `https://localhost:7138${product.productImage}`
              : "placeholder_image_url"
          }
          alt={product.productName}
          className="card-img-top"
        />
        <div className="card-body">
          <p className="card-title">{product.productName}</p>
          <p className="card-text">
            Price:
            {product.discountValue === 0 ? (
              <span>{formatPrice(product.price)}</span>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "red",
                    padding: "10px",
                  }}
                >
                  {formatPrice(product.price)}
                </span>
                <span>
                  {formatPrice(
                    product.price -
                      product.price * product.discountValue
                  )}
                </span>
              </>
            )}
            /{product.unit}
          </p>
          <div
            className="icon-container"
            style={{
              marginTop: "20px", // Đẩy container icon xuống 20px
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-outline-primary"
              onClick={() => handleAddToCart(product.productId)}
              style={{ marginRight: "10px" }}
            >
              <FaCartPlus />
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                handleProductDetailClick(product.productId)
              }
            >
              <FaEye />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
        {error && <p>{error}</p>}
      </div>
    </animated.div>
  );
};

export default YourComponent;
