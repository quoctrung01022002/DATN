import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../../css/Product.css';

function ProductForm() {
  const [product, setProduct] = useState({
    ProductTypeId: '',
    DiscountId: '',
    ProductName: '',
    Description: '',
    Price: 0,
    unit: '',
    Quantity: 0,
    Manufacturer: '',
    IsNew: false,
    SpecialNote: '',
    ImageFile: null,
    CreatedBy: '' 
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setProduct({ ...product, [name]: newValue });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, ImageFile: e.target.files[0] }); // Sửa tên trường thành ImageFile
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit',product)
    const formData = new FormData();
    Object.keys(product).forEach(key => {
      console.log('Submit', product[key])
      formData.append(key, product[key]);
    });
    console.log('Submit',formData)

    try {
      await axios.post('https://localhost:7138/api/Product1/create', formData);
      alert('Sản phẩm đã được tạo thành công!');
      navigate("/productview"); 
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      alert('Lỗi khi tạo sản phẩm. Vui lòng thử lại sau.');
    }
  };
  const handleCancel = () => {
    navigate("/productview"); 
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }} className="mb-3">Tạo Sản Phẩm Mới</h2>
      <form onSubmit={handleSubmit} className="p-3 border">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Mã Loại Sản Phẩm:</label>
            <input type="text" name="ProductTypeId" value={product.ProductTypeId} onChange={handleChange} className="form-control rounded" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mã Giảm Giá:</label>
            <input type="text" name="DiscountId" value={product.DiscountId} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Tên Sản Phẩm:</label>
            <input type="text" name="ProductName" value={product.ProductName} onChange={handleChange} className="form-control rounded" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mô Tả:</label>
            <textarea name="Description" value={product.Description} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Giá:</label>
            <input type="number" name="Price" value={product.Price} onChange={handleChange} className="form-control rounded" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Đơn Vị:</label>
            <input type="text" name="unit" value={product.unit} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Số Lượng:</label>
            <input type="number" name="Quantity" value={product.Quantity} onChange={handleChange} className="form-control rounded" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nhà Sản Xuất:</label>
            <input type="text" name="Manufacturer" value={product.Manufacturer} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Mới:</label>
            <select name="IsNew" value={product.IsNew} onChange={handleChange} className="form-select rounded">
              <option value={true}>Có</option>
              <option value={false}>Không</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ghi Chú Đặc Biệt:</label>
            <textarea name="SpecialNote" value={product.SpecialNote} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Ảnh Sản Phẩm:</label>
            <input type="file" name="ProductImage" onChange={handleFileChange} className="form-control-file" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Người Tạo:</label>
            <input type="text" name="CreatedBy" value={product.CreatedBy} onChange={handleChange} className="form-control rounded" />
          </div>
        </div>
        <div class="button-container">
        <button type="submit" className="btn btn-primary mt-3">Tạo Sản Phẩm</button>
        <button type="button" className="btn btn-secondary mt-3" onClick={handleCancel}>Hủy</button>
        </div>       
      </form>
    </div>
  );
}

export default ProductForm;
