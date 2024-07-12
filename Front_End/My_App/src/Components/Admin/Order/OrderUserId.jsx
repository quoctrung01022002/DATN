import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Table, Button, Modal, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSpring, animated } from "react-spring";
import axios from "axios";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);
  const cookies = new Cookies(null, { path: "/" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://localhost:7138/api/Order/GetSelectedOrderFieldsWithShippersByUserId",
          {
            headers: {
              Authorization: `Bearer ${cookies.get("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
    fetchShippingPrice();
  }, []);

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

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return <span style={{ color: "green" }}>Thanh toán thành công</span>;
      case 2:
        return <span style={{ color: "blue" }}>Đang giao hàng</span>;
      case 3:
        return <span style={{ color: "orange" }}>Gửi hàng</span>;
      case 4:
        return <span style={{ color: "red" }}>Trả hàng</span>;
      default:
        return (
          <span style={{ color: "black" }}>Trạng thái không xác định</span>
        );
    }
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const handleViewDetails = async (orderId) => {
    try {
      const response = await fetch(
        `https://localhost:7138/api/Shipping/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const order = await response.json();
      setSelectedOrder(order);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const calculateDiscountedPrice = (price, discountValue) => {
    if (discountValue) {
      return price * (1 - discountValue);
    }
    return price;
  };

  const calculateTotalPrice = () => {
    if (!selectedOrder) return 0;
    let totalPrice = 0;
    selectedOrder.orderDetails.forEach((orderDetail) => {
      const discountedPrice = calculateDiscountedPrice(
        orderDetail.price,
        orderDetail.discountValue
      );
      totalPrice += orderDetail.quantity * discountedPrice;
    });
    return totalPrice;
  };

  const handleDelete = (orderId) => {
    console.log("Delete order:", orderId);
  };

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className="page-item">
          <button
            className={`page-link ${i === currentPage ? "active" : ""}`}
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
    <animated.div className="introduction-page" style={fadeIn}>
      <div>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Khách Hàng</th>
                <th>Người giao hàng</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order, index) => (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>
                    {order.name} {order.phoneNumber}
                  </td>
                  <td>
                    {order.shipperFirstName} {order.shipperLastName}
                  </td>
                  <td>{getStatusText(order.status)}</td>
                  <td className="datetime-cell">
                    {order.updatedAt
                      ? new Date(order.updatedAt).toLocaleDateString("en-US")
                      : "-"}
                    <br />
                    <span className="time">
                      {order.updatedAt
                        ? new Date(order.updatedAt).toLocaleTimeString("en-US")
                        : ""}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      style={{ marginRight: "10px" }}
                      variant="primary"
                      onClick={() => handleViewDetails(order.orderId)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {/* <Button
                      variant="danger"
                      onClick={() => handleDelete(order.orderId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="pagination">
          <ul className="pagination">{renderPageNumbers()}</ul>
        </div>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          dialogClassName="custom-modal"
          style={{ height: "600px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <Row>
                  <Col md={6}>
                    <p>Mã đơn hàng: HD{selectedOrder.orderId}</p>
                  </Col>
                  <Col md={6}>
                    <p>Họ và tên: {selectedOrder.name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <p>Số điện thoại: {selectedOrder.phoneNumber}</p>
                  </Col>
                  <Col md={6}>
                    <p>Địa chỉ: {selectedOrder.address}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <p>
                      Ngày tạo đơn hàng:{" "}
                      {selectedOrder.orderDate
                        ? new Date(selectedOrder.orderDate).toLocaleDateString(
                            "en-US"
                          )
                        : "-"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>Phương thức thanh toán: {selectedOrder.paymentMethod}</p>
                  </Col>
                </Row>
                <h3>Chi tiết sản phẩm</h3>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Ảnh sản phẩm</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td>
                          {detail.productImage && (
                            <img
                              src={`https://localhost:7138${detail.productImage}`}
                              alt={detail.productName}
                              className="img-fluid"
                              style={{ maxWidth: "100px", cursor: "pointer" }}
                            />
                          )}
                        </td>
                        <td>{detail.productName}</td>
                        <td>{detail.quantity}</td>
                        <td>
                          {detail.discountValue ? (
                            <>
                              <span style={{ textDecoration: "line-through" }}>
                                {detail.price.toLocaleString("vi-VN")}đ
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
                            `${detail.price.toLocaleString("vi-VN")}đ`
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3">Tiền vận chuyển:</td>
                      <td>
                        {Number.isFinite(shippingPrice)
                          ? shippingPrice.toLocaleString("vi-VN")
                          : "0"}
                        đ
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">Thành tiền:</td>
                      <td>
                        {Number.isFinite(calculateTotalPrice()) &&
                        Number.isFinite(shippingPrice)
                          ? (
                              calculateTotalPrice() + shippingPrice
                            ).toLocaleString("vi-VN")
                          : "0"}
                        đ
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </animated.div>
  );
};

export default OrdersTable;
