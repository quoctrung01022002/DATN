import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/Status1.css";
import Cookies from "universal-cookie";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1; // Số đơn hàng mỗi trang
  const cookies = new Cookies(null, { path: "/" });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7138/api/Shipping/order-status-2",
          {
            headers: {
              Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
          }
        );
        const updatedOrders = response.data.map((order) => ({
          ...order,
          totalPrice: calculateTotalPrice(order),
        }));
        setOrders(updatedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    const fetchShippingPrice = async () => {
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

    fetchOrders();
    fetchShippingPrice();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7138/api/Shipping/order-status-2",
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      const updatedOrders = response.data.map((order) => ({
        ...order,
        totalPrice: calculateTotalPrice(order),
      }));
      setOrders(updatedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      await axios.post(
        `https://localhost:7138/api/Shipping/${orderId}/ship`,
        null,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      fetchOrders(); // Gọi lại fetchOrders để cập nhật danh sách đơn hàng
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleReturnOrder = async (orderId) => {
    try {
      await axios.post(
        `https://localhost:7138/api/Shipping/${orderId}/return`,
        null,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      fetchOrders(); // Gọi lại fetchOrders để cập nhật danh sách đơn hàng
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const calculateDiscountedPrice = (price, discountValue) => {
    if (discountValue) {
      return price * (1 - discountValue);
    }
    return price;
  };

  const calculateTotalPrice = (order) => {
    let totalPrice = 0;

    if (order.orderDetails && order.orderDetails.length > 0) {
      totalPrice = order.orderDetails.reduce((acc, orderDetail) => {
        const discountedPrice = calculateDiscountedPrice(
          orderDetail.price,
          orderDetail.discountValue
        );
        return acc + (orderDetail.quantity * discountedPrice || 0);
      }, 0);
    }

    totalPrice += shippingPrice || 0;

    return totalPrice;
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Lấy các đơn hàng hiện tại theo trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Tạo các nút điều hướng trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="order-list-container">
      <h1>Orders with status 2</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul className="order-list">
            {currentOrders.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-info">
                  <h2 className="order-heading">
                    Order ID: HD00{order.orderId}
                  </h2>
                  <p>Họ và tên: {order.name}</p>
                  <p>Số điện thoại: {order.phoneNumber}</p>
                  <p>Địa chỉ: {order.address}</p>
                  <p>
                    Ngày tạo đơn hàng:{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString("en-US")
                      : "-"}
                    &nbsp;&nbsp;
                    <span className="time">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleTimeString("en-US")
                        : ""}
                    </span>
                  </p>
                  <p>Phương thức thanh toán: {order.paymentMethod}</p>
                  <h3>Đơn hàng đã đặt</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Ảnh sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderDetails.map((detail, index) => (
                        <tr key={index}>
                          <td>
                            {detail.productImage && (
                              <div className="product-image-container">
                                {" "}
                                {/* Thêm một div bao bọc */}
                                <img
                                  src={`https://localhost:7138${detail.productImage}`}
                                  alt={detail.title}
                                  style={{
                                    maxWidth: "100px",
                                    cursor: "pointer",
                                  }}
                                  // onClick={() =>
                                  //   handleOpenImageModal(
                                  //     `https://localhost:7138${order.productImage}`
                                  //   )
                                  // }
                                />
                              </div>
                            )}
                          </td>
                          <td>{detail.productName}</td>
                          <td>{detail.quantity}</td>
                          <td>
                            {detail.discountValue ? (
                              <>
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  {Number.isFinite(detail.price)
                                    ? detail.price.toLocaleString("vi-VN")
                                    : "0"}
                                  đ
                                </span>{" "}
                                {Number.isFinite(
                                  calculateDiscountedPrice(
                                    detail.price,
                                    detail.discountValue
                                  )
                                )
                                  ? calculateDiscountedPrice(
                                      detail.price,
                                      detail.discountValue
                                    ).toLocaleString("vi-VN")
                                  : "0"}
                                đ
                              </>
                            ) : (
                              `${
                                Number.isFinite(detail.price)
                                  ? detail.price.toLocaleString("vi-VN")
                                  : "0"
                              }đ`
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4">
                          Tiền vận chuyển:{" "}
                          {Number.isFinite(shippingPrice)
                            ? shippingPrice.toLocaleString("vi-VN")
                            : "0"}
                          đ
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          Thành tiền:{" "}
                          {Number.isFinite(shippingPrice) &&
                          Number.isFinite(order.totalPrice)
                            ? (
                                shippingPrice + order.totalPrice
                              ).toLocaleString("vi-VN")
                            : "0"}
                          đ
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {order.status === 2 && (
                    <>
                      <div className="button-container">
                        <button
                          className="ship-button"
                          onClick={() => handleShipOrder(order.orderId)}
                        >
                          Gửi hàng
                        </button>
                        <button
                          className="return-button"
                          onClick={() => handleReturnOrder(order.orderId)}
                        >
                          Trả hàng
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handleClick(number)}
                className={number === currentPage ? "active" : ""}
                style={{
                  margin: "0 5px",
                  padding: "10px 15px",
                  border: "none",
                  backgroundColor:
                    number === currentPage ? "#0056b3" : "#007bff",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                }}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;

