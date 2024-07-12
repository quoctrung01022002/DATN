import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faEye } from "@fortawesome/free-solid-svg-icons";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Order/GetSelectedOrderFieldsWithShippers");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async (orderId) => {
    console.log(orders)
    try {
      await axios.delete(`https://localhost:7138/api/Order/DeleteOrder/${orderId}`);
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(`https://localhost:7138/api/Order/GetSelectedOrderFieldsWithShippers/${orderId}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
        <li key={i}>
          <button
            className={i === currentPage ? "active" : ""}
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
    <div style={{marginTop: "-25px"}} className="container">
      <h2 style={{ textAlign: "center",display: "block" }}  className="mt-4 mb-4">Danh sách đơn hàng</h2>
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
              <td>{order.shipperFirstName} {order.shipperLastName}</td>
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
                <Button style={{ marginRight: "10px" }} variant="primary" onClick={() => handleViewDetails(order.orderId)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                {/* <Button variant="danger" onClick={() => handleDelete(order.orderId)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p>Khách hàng: {selectedOrder.firstName} {selectedOrder.lastName} {selectedOrder.phoneNumber}</p>
              <p>Người giao hàng: {selectedOrder.shipperFirstName} {selectedOrder.shipperLastName}</p>
              <p>Trạng thái: {getStatusText(selectedOrder.status)}</p>
              <p>Cập nhật:  {selectedOrder.updatedAt
                    ? new Date(selectedOrder.updatedAt).toLocaleDateString("en-US")
                    : "-"}
                  <br />
                  <span className="time">
                    {selectedOrder.updatedAt
                      ? new Date(selectedOrder.updatedAt).toLocaleTimeString("en-US")
                      : ""}
                  </span></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pagination">
        <ul>
          {renderPageNumbers()}
        </ul>
      </div>
    </div>
  );
}

export default Orders;

function getStatusText(status) {
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
      return <span style={{ color: "black" }}>Trạng thái không xác định</span>;
  }
}
