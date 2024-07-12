// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import Cookies from "universal-cookie";
// import "../../css/OrderDetail.css";

// const OrderDetail = () => {
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const [shippingPrice, setShippingPrice] = useState(0);
//   const cookies = new Cookies(null, { path: "/" });

//   useEffect(() => {
//     const cookies = new Cookies(null, { path: "/" });
//     const token = cookies.get("accessToken");
//     if (token) {
//       fetchOrder(token);
//     }
//   }, []);

//   useEffect(() => {
//     if (order) {
//       calculateTotalPrice();
//     }
//   }, [order, shippingPrice]);

//   useEffect(() => {
//     fetchShippingPrice();
//   }, []);

//   const fetchOrder = async (token) => {
//     try {
//       const query = new URLSearchParams(location.search);
//       const vnp_TxnRef = query.get("vnp_TxnRef");

//       const response = await axios.get(
//         `https://localhost:7138/api/Order/${vnp_TxnRef}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Order fetched:", response.data);
//       setOrder(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching order:", error);
//       setLoading(false);
//     }
//   };

//   const fetchShippingPrice = async () => {
//     try {
//       const response = await axios.get("https://localhost:7138/api/Shipping");
//       if (response.data.length > 0) {
//         setShippingPrice(response.data[0].shippingUnitPrice);
//       } else {
//         console.error("No shipping data found");
//       }
//     } catch (error) {
//       console.error("Error fetching shipping:", error);
//     }
//   };

//   const calculateDiscountedPrice = (price, discountValue) => {
//     if (discountValue) {
//       return price * (1 - discountValue);
//     }
//     return price;
//   };

//   const calculateTotalPrice = () => {
//     let totalPrice = 0;
//     order.orderDetails.forEach((orderDetail) => {
//       const discountedPrice = calculateDiscountedPrice(
//         orderDetail.price,
//         orderDetail.discountValue
//       );
//       totalPrice += orderDetail.quantity * discountedPrice;
//     });
//     totalPrice += shippingPrice;
//     return totalPrice;
//   };

//   if (loading) {
//     return <div className="order-detail-loading">Loading...</div>;
//   }

//   if (!order || !order.orderId) {
//     return <div className="order-detail-not-found">Order not found</div>;
//   }

//   return (
//     <div className="order-detail-container">
//       <h2>Order Detail</h2>
//       <div className="order-info-order">
//         <p>Mã đơn hàng: HD00{order.orderId}</p>
//         <p>
//           Họ và tên: {order.firstName} {order.lastName}
//         </p>
//         <p>Số điện thoại: {order.phoneNumber}</p>
//         <p>Địa chỉ: {order.address}</p>
//         <p>
//           Ngày tạo đơn hàng:{" "}
//           {order.orderDate
//             ? new Date(order.orderDate).toLocaleDateString("en-US")
//             : "-"}
//           &nbsp;&nbsp;
//           <span className="time">
//             {order.orderDate
//               ? new Date(order.orderDate).toLocaleTimeString("en-US")
//               : ""}
//           </span>
//         </p>

//         <p>Phương thức thanh toán: {order.paymentMethod}</p>
//       </div>
//       <h3>Đơn hàng đã đặt</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Ảnh sản phẩm</th>
//             <th>Tên sản phẩm</th>
//             <th>Số lượng</th>
//             <th>Giá tiền</th>
//           </tr>
//         </thead>
//         <tbody>
//           {order.orderDetails.map((detail, index) => (
//             <tr key={index}>
//               <td>
//                 {detail.productImage && (
//                   <div className="product-image-container">
//                     {" "}
//                     {/* Thêm một div bao bọc */}
//                     <img
//                       src={`https://localhost:7138${detail.productImage}`}
//                       alt={detail.title}
//                       style={{
//                         maxWidth: "100px",
//                         cursor: "pointer",
//                       }}
//                     />
//                   </div>
//                 )}
//               </td>
//               <td>{detail.productName}</td>
//               <td>{detail.quantity}</td>
//               <td>
//                 {detail.discountValue ? (
//                   <>
//                     <span style={{ textDecoration: "line-through" }}>
//                       {detail.price}đ
//                     </span>{" "}
//                     {calculateDiscountedPrice(
//                       detail.price,
//                       detail.discountValue
//                     )}
//                     đ
//                   </>
//                 ) : (
//                   `${detail.price}đ`
//                 )}
//               </td>
//             </tr>
//           ))}
//           <tr>
//             <td colSpan="4">Tiền vận chuyển: {shippingPrice}đ</td>
//           </tr>
//           <tr>
//             <td colSpan="4">Thành tiền: {calculateTotalPrice()}đ</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderDetail;
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import "../../css/OrderDetail.css";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [accessToken, setAccessToken] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);

  useEffect(() => {
    const cookies = new Cookies(null, { path: "/" });
    const token = cookies.get("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchOrder();
    }
  }, [accessToken, location.search]);

  useEffect(() => {
    fetchShippingPrice();
  }, []);

  const fetchOrder = async () => {
    try {
      const query = new URLSearchParams(location.search);
      const vnp_TxnRef = query.get("vnp_TxnRef");
      const response = await axios.get(
        `https://localhost:7138/api/Order/${vnp_TxnRef}`
      );
      setOrder(response.data);
      setLoading(false);
      await handleExecutePayment();
    } catch (error) {
      console.error("Error fetching order:", error);
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

  const handleExecutePayment = async () => {
    try {
      await axios.get(
        `https://localhost:7138/api/VnPayment/ExecuteVNPayPayment${location.search}`
      );
      console.log("Payment executed successfully");
    } catch (error) {
      console.error("Error executing payment:", error);
    }
  };

  if (loading) {
    return <div className="order-detail-loading">Loading...</div>;
  }

  if (!order || !order.orderId) {
    return <div className="order-detail-not-found">Order not found</div>;
  }

  const calculateDiscountedPrice = (price, discountValue) => {
    if (discountValue) {
      return price * (1 - discountValue);
    }
    return price;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    order.orderDetails.forEach((orderDetail) => {
      const discountedPrice = calculateDiscountedPrice(
        orderDetail.price,
        orderDetail.discountValue
      );
      totalPrice += orderDetail.quantity * discountedPrice;
    });
    return totalPrice;
  };

  return (
    <div className="order-detail-container">
      <h2>Order Detail</h2>
      <div className="order-info-order">
        <p>Mã đơn hàng: HD{order.orderId}</p>
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
      </div>
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
                    />
                  </div>
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
            <td colSpan="4">
              Tiền vận chuyển: {shippingPrice.toLocaleString("vi-VN")}đ
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              Thành tiền:{" "}
              {Number.isFinite(calculateTotalPrice()) &&
              Number.isFinite(shippingPrice)
                ? (calculateTotalPrice() + shippingPrice).toLocaleString(
                    "vi-VN"
                  )
                : "0"}
              đ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetail;
