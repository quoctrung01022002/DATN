import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/CheckCard.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSpring, animated } from "react-spring";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shippingPrice, setShippingPrice] = useState(0);
  const cookies = new Cookies(null, { path: "/" });
  const [isLoggedIn, setIsLoggedIn] = useOutletContext();
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [, , setCountCart] = useOutletContext();

  if (!isLoggedIn) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7138/api/Product/GetCart",
          {
            headers: {
              Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
          }
        );
        const data =response.data;
        // data.map(async (item) => {
        //   const response = await axios.get(
        //     `https://localhost:7138/api/Product1/${item.product.productId}`
        //   );
        //   const max = response.data.quantity;
        //   max == 0 ? item.isDisable = true : item.isDisable = false;
        // })
        console.log(data)
        setCart(data);
        localStorage.setItem("countCart", response.data.length);
        setCountCart(response.data.length);
        

        //setIsCheckboxDisabled(response.data.length === 0); // Disable checkbox if cart is empty
      } catch (error) {
        setError("Wrong credential");
        toast.error("Thông tin xác thực sai", {
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

    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
    fetchShipping();
  }, [selectedProducts]);

  const fetchShipping = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Shipping");
      if (response.data.length > 0) {
        setShippingPrice(response.data[0].shippingUnitPrice);
      } else {
        console.error("No shipping data found");
      }
    } catch (error) {
      console.error("Error fetching shipping:", error);
    }
  };

  const calculateTotalPrice = (
    numSelectedProducts = selectedProducts.length
  ) => {
    let totalPrice = 0;
    cart.forEach((item) => {
      if (selectedProducts.includes(item.product.productId)) {
        if (item.product.discount === null) {
          totalPrice += item.product.price * item.quantity;
        } else {
          totalPrice +=
            (item.product.price -
              item.product.price * item.product.discount.discountValue) *
            item.quantity;
        }
      }
    });
    totalPrice += shippingPrice * numSelectedProducts;
    setTotalPrice(Math.floor(totalPrice));
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("https://localhost:7138/api/Product/ClearCart", {
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      });
      setCart([]);
      setSelectedProducts([]);
      setTotalPrice(0);
    } catch (error) {
      setError("Wrong credential 401");
      toast.error("Thông tin xác thực sai 401", {
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

  const handleEditCartItem = async (productId, quantityChange) => {
    try {
      const product = cart.find((item) => item.product.productId === productId);
      const newQuantity = Number(product.quantity) + Number(quantityChange);
      console.log("fas", newQuantity);
      if (newQuantity <= 0) {
        handleDeleteCartItem(productId);
        return;
      }

      await axios.put(
        `https://localhost:7138/api/Product/EditCartItem`,
        {
          productId: product.product.productId,
          quantity: newQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      const updatedCart = cart.map((item) => {
        if (item.product.productId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCart(updatedCart);
    } catch (error) {
      setError("Wrong credential 401");
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
    }
  };

  const handleDeleteCartItem = async (productId) => {
    try {
      await axios.delete(
        `https://localhost:7138/api/Product/DeleteCartItem/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      const updatedCart = cart.filter(
        (item) => item.product.productId !== productId
      );
      setCart(updatedCart);
      setCountCart(updatedCart.length);
      localStorage.setItem("countCart", updatedCart.length);
    } catch (error) {
      setError("Wrong credential 401");
      toast.error("Thông tin xác thực sai 401", {
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
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const handleToggleProductSelection = (productId) => {
    const isSelected = selectedProducts.includes(productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
    calculateTotalPrice(selectedProducts.length + 1);
  };

  const handleBuySelectedProducts = async () => {
    try {
      const selectedCartItems = cart.filter((item) =>
        selectedProducts.includes(item.product.productId)
      );

      const orderItems = selectedCartItems.map((item) => {
        let discountValue;
        if (
          item.discount &&
          item.discount.discountValue === item.product.discountValue
        ) {
          discountValue = item.discount.discountValue;
        } else {
          // Some logic to derive discountValue from discountId
        }

        return {
          productId: item.product.productId,
          discountValue: discountValue,
          quantity: item.quantity,
        };
      });

      const response = await axios.post(
        "https://localhost:7138/api/Order/CreateOrder",
        {
          cartItems: orderItems,
          selectedTotalPrice: totalPrice,
          shippingPrice: shippingPrice,
          returnUrl: "http://127.0.0.1:5173/OrderDetail",
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );

      window.location.href = response.data;
    } catch (error) {
      setError("Wrong credential 401");
      toast.error("Thông tin xác thực sai 401", {
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

  const handleInputChange = async (productId, event) => {
    const inputValue = event.target.value.trim();
    const newQuantity = inputValue;
    console.log("----", newQuantity);
    if (newQuantity !== null && !isNaN(newQuantity)) {
      const updatedCart = cart.map((item) => {
        if (item.product.productId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCart(updatedCart);
    }
  };

  const handleInputBlur = async (productId, event) => {
    let newQuantity = parseInt(event.target.value);
    const response = await axios.get(
      `https://localhost:7138/api/Product1/${productId}`
    );
    const max = response.data.quantity;
    console.log("data", response.data);
    if (newQuantity <= 0) {
      await handleDeleteCartItem(productId);
      return;
    }
    if (newQuantity > max) {
      newQuantity = max;
    }
    console.log("data", newQuantity);
    await axios.put(
      `https://localhost:7138/api/Product/EditCartItem`,
      {
        productId: productId,
        quantity: newQuantity,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      }
    );

    const updatedCart = cart.map((item) => {
      if (item.product.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    return;

    // const cartDetail = cart.find((item) => item.product.productId == productId);
    // console.log(cartDetail.quantity, "------", newQuantity);
    // if (newQuantity !==  Number(cartDetail.quantity)) {
    //   console.log("Quantity");
    //   handleEditCartItem(productId, newQuantity);
    // }
  };

  console.log("Cart", cart);

  return (
    <animated.div className="introduction-page" style={fadeIn}>
      <div className="container">
        {cart.length === 0 ? (
          <p className="empty-cart">Giỏ của bạn trống trơn</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Chọn</th>
                  <th scope="col">Hình ảnh sản phẩm</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Đơn giá</th>
                  <th scope="col">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) =>  (
                  <tr key={item.product.productId}  className={item.product.quantity < item.quantity ? "disabled-cart-item" : ""}>
                    <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(
                        item.product.productId
                      )}
                      onChange={() =>
                        handleToggleProductSelection(item.product.productId)
                      }
                     
                    />
                  </td>

                    <td>
                      <img
                        src={`https://localhost:7138${item.product.productImage}`}
                        alt={item.product.productName}
                        style={{ maxWidth: "100px", cursor: "pointer" }}
                        className="img-fluid"
                      />
                    </td>
                    <td>{item.product.productName}</td>
                    <td>
                      {item.product.discountId === 13 ? (
                        <span>{item.product.price}đ</span>
                      ) : (
                        <>
                          {item.product.discount == null ||
                          item.product.discount.discountValue === 0 ? (
                            <span>
                              {item.product.price.toLocaleString("vi-VN")}đ
                            </span>
                          ) : (
                            <>
                              <span style={{ textDecoration: "line-through" }}>
                                {item.product.price.toLocaleString("vi-VN")}đ
                              </span>
                              <span
                                style={{
                                  display: "inline-block",
                                  margin: "10px",
                                }}
                              >
                                {Number.isFinite(
                                  (item.product.price -
                                    item.product.price *
                                      item.product.discount.discountValue) *
                                    item.quantity
                                )
                                  ? (
                                      (item.product.price -
                                        item.product.price *
                                          item.product.discount.discountValue) *
                                      item.quantity
                                    ).toLocaleString("vi-VN")
                                  : "0"}
                                đ
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      <div className="cart-item-actions d-flex">
                        <button
                          type="button"
                          className="btn btn-secondary mr-1"
                          onClick={() =>
                            handleEditCartItem(item.product.productId, 1)
                          }
                          disabled={isAddButtonDisabled}
                        >
                          <FaPlus />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleInputChange(item.product.productId, e)
                          }
                          onBlur={(e) =>
                            handleInputBlur(item.product.productId, e)
                          }
                          className="form-control cart-item-quantity"
                        />
                        <button
                          type="button"
                          className="btn btn-secondary ml-1"
                          onClick={() =>
                            handleEditCartItem(item.product.productId, -1)
                          }
                        >
                          <FaMinus />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger ml-2"
                          onClick={() =>
                            handleDeleteCartItem(item.product.productId)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <button
                  className="btn btn-danger btn-block"
                  onClick={handleClearCart}
                >
                  Xóa tất cả sản phẩm
                </button>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="buttons-container">
                  <p
                    style={{ marginBottom: "-10px" }}
                    className="shipping-price"
                  >
                    Giá vận chuyển: {shippingPrice.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="total-price">
                    Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ
                  </p>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleBuySelectedProducts}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* {error && <p className="error">Error: {error}</p>} */}
      </div>
    </animated.div>
  );
};

export default Cart;
