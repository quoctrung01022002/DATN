import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCartPlus, FaEye } from "react-icons/fa";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import "../../css/Check.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const Check = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const cookies = new Cookies(null, { path: "/" });
  const location = useLocation();
  const navigate = useNavigate();

  const [, , setCountCart, haveSearch] = useOutletContext();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    let keyword = query.get("keyword");

    const fetchData = async () => {
      console.log("Fetching data", keyword);
      try {
        let url = "https://localhost:7138/api/Product1";
        if (keyword)
          url = `https://localhost:7138/api/Product1/search?keyword=${keyword}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [haveSearch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7138/api/ProductType"
        );
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    fetchProductsByCategory(categoryId);
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://localhost:7138/api/Product1/producttype/${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMinPriceChange = (event) => {
    if (event.target.value >= 0) {
      setMinPrice(event.target.value);
    }
  };

  const handleMaxPriceChange = (event) => {
    if (event.target.value >= 0) {
      setMaxPrice(event.target.value);
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFilterByPrice = async () => {
    try {
      let url = `https://localhost:7138/api/Product1/price?minPrice=${minPrice}&maxPrice=${maxPrice}`;
      if (selectedCategoryId) {
        url += `&productTypeId=${selectedCategoryId}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleShowAllProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Product1");
      setProducts(response.data);
    } catch (error) {
      setError(error.message);
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

      const numberCart = await axios.get(
        "https://localhost:7138/api/Product/CountUniqueProducts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.setItem("countCart", numberCart.data);
      setCountCart(numberCart.data);

      toast.success("Đã thêm vào giỏ hàng thành công!", {
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
      if (error.response) {
        if (error.response.status === 402 || error.response.status === 403) {
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

  

  const handleProductDetailClick = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

  const totalPages = Math.ceil(products.length / 8);
  const indexOfLastProduct = currentPage * 8;
  const indexOfFirstProduct = indexOfLastProduct - 8;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div className="introduction-page" style={fadeIn}>
      <div className="container">
        <div className="breadcrumb">
          <h2 className="breadcrumb-title">Hạt giống</h2>
          <p className="breadcrumb-subtitle">Trang chủ/Hạt giống</p>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 style={{ textAlign: "center" }} className="card-title">
                  DANH MỤC
                </h5>
                <ul className="list-group list-group-flush">
                  {categories.map((category) => (
                    <li
                      key={category.productTypeId}
                      className="list-group-item"
                    >
                      <button
                        onClick={() =>
                          handleSelectCategory(category.productTypeId)
                        }
                        className="btn btn-outline-dark btn-sm w-100"
                      >
                        {category.productTypeName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">Lọc theo giá</h5>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Giá tối thiểu"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Giá tối đa"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                  />
                </div>
              </div>
              <div className="card-footer">
                <button
                  onClick={handleFilterByPrice}
                  className="btn btn-outline-primary w-100"
                >
                  Lọc tất cả sản phẩm
                </button>
              </div>
              <div className="card-body">
                <button
                  onClick={handleShowAllProducts}
                  className="btn btn-outline-dark w-100"
                >
                  Hiển thị tất cả sản phẩm
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row">
              {currentProducts.map((product, index) => (
                <div key={index} className="col-md-3 mb-4">
                  <div className="card">
                    {/* Discount Badge */}
                    {product.discountValue !== undefined &&
                      product.discountValue !== 0 && (
                        <div
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
                          className="discount-badge"
                        >
                          {product.discountValue * 100}% OFF
                        </div>
                      )}

                    {/* New Badge */}
                    {product.isNew && (
                      <div
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
                        className="new-badge"
                      >
                        Mới
                      </div>
                    )}

                    {/* Product Image */}
                    <img
                      src={`https://localhost:7138${product.productImage}`}
                      className="card-img-top"
                      alt={product.productName}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        marginTop: "30px", // Đẩy hình ảnh xuống 10px
                      }}
                    />

                    {/* Card Body */}
                    <div className="card-body">
                      <h6 className="card-title">
                        {product.productName.slice(0, 17)}
                        {product.productName.length > 17 ? "..." : ""}
                      </h6>
                      <p className="card-text">
                        {/* Product Price */}
                        {product.discountValue === 0 ? (
                          <>{formatPrice(product.price)}₫</>
                        ) : (
                          <>
                            <span className="text-decoration-line-through text-danger">
                              {formatPrice(product.price)}₫
                            </span>{" "}
                            {formatPrice(
                              product.price -
                                product.price * product.discountValue
                            )}
                            ₫
                          </>
                        )}
                        {/* Product Unit */}/ {product.unit}
                      </p>
                      {/* Add to Cart Button */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0 15px",
                        }}
                      >
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleAddToCart(product.productId)}
                          style={{ flex: 1, margin: "0 5px" }}
                        >
                          <FaCartPlus />
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            handleProductDetailClick(product.productId)
                          }
                          style={{ flex: 1, margin: "0 5px" }}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-outline-primary me-2"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>
                Trang {currentPage} trên {totalPages}
              </span>
              <button
                className="btn btn-outline-primary ms-2"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Kế tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Check;
