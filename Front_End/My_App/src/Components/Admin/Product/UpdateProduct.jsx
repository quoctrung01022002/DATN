import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ProductUpdate() {
  const [product, setProduct] = useState({
    ProductTypeId: "",
    DiscountId: "",
    ProductName: "",
    Description: "",
    Price: 0,
    unit: "",
    Quantity: 0,
    Manufacturer: "",
    IsNew: false,
    SpecialNote: "",
    ImageFile: null,
    UpdateBy: "",
  });
  const { productId } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7138/api/Product1/${productId}`
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
      };
      fetchProduct();
    }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox"
        ? checked
        : name === "ImageFile"
        ? e.target.files[0]
        : value;
    setProduct({ ...product, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "updateAt") {
        formData.append(key, product[key]);
      }
    });
    try {
      const response = await axios.put(
        `https://localhost:7138/api/Product1/${productId}`,
        formData
      );
      if (response.status === 200) {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/productview");
      } else {
        alert("Lỗi khi cập nhật sản phẩm. Vui lòng thử lại sau.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Sản phẩm không tồn tại.");
      } else {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Lỗi khi cập nhật sản phẩm. Vui lòng thử lại sau.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/productview");
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Cập nhật sản phẩm
      </h2>
      <form onSubmit={handleSubmit} className="p-3 border">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Mã loại sản phẩm:</label>
            <input
              type="text"
              name="productTypeId"
              value={product.productTypeId}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mã giảm giá:</label>
            <input
              type="text"
              name="discountId"
              value={product.discountId}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Tên sản phẩm:</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mô tả:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Giá:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Đơn vị:</label>
            <input
              type="text"
              name="unit"
              value={product.unit}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Số lượng:</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nhà sản xuất:</label>
            <input
              type="text"
              name="manufacturer"
              value={product.manufacturer}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Mới:</label>
            <select
              name="isNew"
              value={product.isNew}
              onChange={handleChange}
              className="form-select rounded"
            >
              <option value={true}>Có</option>
              <option value={false}>Không</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ghi chú đặc biệt:</label>
            <textarea
              name="specialNote"
              value={product.specialNote}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Ảnh sản phẩm:</label>
            <input
              type="file"
              name="ImageFile"
              onChange={handleChange}
              className="form-control-file"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Người cập nhật:</label>
            <input
              type="text"
              name="updateBy"
              value={product.updateBy}
              onChange={handleChange}
              className="form-control rounded"
            />
          </div>
        </div>
        <div className="button-container">
          <button type="submit" className="btn btn-primary mt-3">
            Cập nhật sản phẩm
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={handleCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductUpdate;
