import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    productName: "",
    productTypeId: "",
    discountId: "",
    brandId: "",
    supplierId: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "",
    manufacturer: "",
    isNew: false,
    specialNote: "",
    createdBy: "",
    updateBy: "",
    ImageFile: null,
  });
  const [productTypes, setProductTypes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Product1");
      console.log("response.data", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7138/api/Product1/search?keyword=${searchKeyword}`
      );
      setSearchResults(response.data);
      console.log("ádas", response.data);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Error searching products. Please try again later.");
    }
  };
  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const fetchDropdownData = async () => {
    try {
      const productTypeResponse = await axios.get(
        "https://localhost:7138/api/ProductType"
      );
      setProductTypes(productTypeResponse.data);

      const discountResponse = await axios.get(
        "https://localhost:7138/api/Discount"
      );
      setDiscounts(discountResponse.data);

      const brandResponse = await axios.get("https://localhost:7138/api/Brand");
      setBrands(brandResponse.data);

      const supplierResponse = await axios.get(
        "https://localhost:7138/api/Supplier"
      );
      setSuppliers(supplierResponse.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productTypeId: product.productTypeId,
      discountId: product.discountId,
      brandId: product.brandId,
      supplierId: product.supplierId,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      manufacturer: product.manufacturer,
      isNew: product.isNew,
      specialNote: product.specialNote,
      updateBy: product.updateBy,
      ImageFile: null,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      productName: "",
      productTypeId: "",
      discountId: "",
      brandId: "",
      supplierId: "",
      description: "",
      price: 0,
      quantity: 0,
      manufacturer: "",
      isNew: false,
      specialNote: "",
      createdBy: "",
      updateBy: "",
      ImageFile: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
  
    let newValue;
    
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value >= 0 ? value : 0;
    } else {
      newValue = value;
    }
  
    setFormData({ ...formData, [name]: newValue });
  };
  
  const handleDropdownClick = (inputName) => {
    setShowDropdown(!showDropdown);
    setActiveDropdown(inputName);
  };

  const handleProductTypeSelect = (product) => {
    setSelectedProductType(product);
    setFormData({
      ...formData,
      productTypeId: product.productTypeId,
      productTypeName: product.productTypeName,
    });
    setShowDropdown(false);
  };

  const handleDiscountSelect = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      ...formData,
      discountId: discount.discountId,
      discountValue: discount.discountValue,
    });
    setShowDropdown(false);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setFormData({
      ...formData,
      brandId: brand.brandId,
      countryOfOrigin: brand.countryOfOrigin,
    });
    setShowDropdown(false);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      ...formData,
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
    });
    setShowDropdown(false);
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFormData({ ...formData, ImageFile: imageFile });
  };

  const handleSaveEdit = async (productId, formData) => {
    try {
      // Tạo một FormData mới để chứa dữ liệu cập nhật
      const formDataToSend = new FormData();

      // Thêm các trường dữ liệu cần thiết vào FormData
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("manufacturer", formData.manufacturer);
      formDataToSend.append("isNew", formData.isNew);
      formDataToSend.append("specialNote", formData.specialNote);
      formDataToSend.append("updateBy", formData.updateBy);

      // Thêm các trường dropdown vào FormData nếu có giá trị
      if (formData.brandId !== undefined && formData.brandId !== null) {
        formDataToSend.append("brandId", formData.brandId);
      }
      if (
        formData.productTypeId !== undefined &&
        formData.productTypeId !== null
      ) {
        formDataToSend.append("productTypeId", formData.productTypeId);
      }
      if (formData.discountId !== undefined && formData.discountId !== null) {
        formDataToSend.append("discountId", formData.discountId);
      }
      if (formData.supplierId !== undefined && formData.supplierId !== null) {
        formDataToSend.append("supplierId", formData.supplierId);
      }

      // Gửi yêu cầu PUT đến server
      const response = await axios.put(
        `https://localhost:7138/api/Product1/${productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Kiểm tra kết quả từ server và xử lý phản hồi
      if (response.status === 200) {
        // Nếu cập nhật thành công, đóng modal, cập nhật sản phẩm và hiển thị thông báo
        setShowModal(false);
        setEditingProduct(null);
        fetchData(); // Giả sử fetchData là hàm để tải lại dữ liệu sản phẩm
        toast.success("Sản phẩm được cập nhật thành công.", {
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
        // Nếu có lỗi từ server, hiển thị thông báo lỗi
        console.error("Error updating product:", response.statusText);
        toast.error("Error updating product. Please try again later.", {
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
    } catch (error) {
      // Xử lý lỗi trong trường hợp có lỗi từ phía client hoặc mạng
      console.error("Error updating product:", error);
      toast.error("Error updating product. Please try again later.", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://localhost:7138/api/Product1/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        setFormData({
          productName: "",
          productTypeId: "",
          discountId: "",
          brandId: "",
          supplierId: "",
          description: "",
          price: 0,
          quantity: 0,
          manufacturer: "",
          isNew: false,
          specialNote: "",
          createdBy: "",
          updateBy: "",
          ImageFile: null,
        });
        fetchData();
        toast.success("Sản phẩm được thêm thành công.", {
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
        console.error("Error adding product:", response.statusText);
        toast.error("Lỗi khi thêm sản phẩm. Vui lòng thử lại sau.", {
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
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Lỗi khi thêm sản phẩm. Vui lòng thử lại sau.", {
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

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7138/api/Product1/${productId}`);
        setProducts(
          products.filter((product) => product.productId !== productId)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product. Please try again later.", {
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
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

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
    <div className="table-wrapper">
      <div style={{ marginTop: "-25px" }} className="container">
        <h2
          style={{ textAlign: "center", display: "block" }}
          className="mt-4 mb-4"
        >
          Danh Sách Sản Phẩm
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ marginRight: "10px", width: "200px" }} 
            />
            <Button variant="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
          <Button variant="success" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Thêm mới sản phẩm
          </Button>
        </div>

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên Sản Phẩm</th>
              <th scope="col">Ảnh Sản Phẩm</th>
              {/* <th scope="col">Loại Sản Phẩm</th>
              <th scope="col">Giảm Giá</th>
              <th scope="col">Thương Hiệu</th>*/}
              {/* <th scope="col">Mô tả</th>  */}
              <th scope="col">Giá</th>
              <th scope="col">Số Lượng</th>
              <th scope="col">Đơn Vị Tính</th>
              <th scope="col">Nhà Sản Xuất</th>
              <th scope="col">Mới</th>
              <th scope="col">Ngày Tạo</th>
              {/* <th scope="col">Người Tạo</th> */}
              <th scope="col">Ngày Cập Nhật</th>
              {/* <th scope="col">Người Cập Nhật</th> */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through products */}
            {searchResults.length > 0
              ? searchResults.map((product, index) => (
                  <tr key={product.productId}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td>
                      {product.productImage && (
                        <img
                          src={`https://localhost:7138${product.productImage}`}
                          alt={product.title}
                          style={{
                            maxWidth: "100px",
                            cursor: "pointer",
                            borderRadius: "50%",
                          }}
                          onClick={() =>
                            handleOpenImageModal(
                              `https://localhost:7138${product.productImage}`
                            )
                          }
                        />
                      )}
                    </td>
                    {/* <td>{product.description}</td> */}
                    <td>{product.price.toLocaleString("vi-VN")}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit}</td>
                    <td>{product.manufacturer}</td>
                    <td>{product.isNew ? "Có" : "Không"}</td>
                    <td className="datetime-cell">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString(
                            "en-US"
                          )
                        : "-"}
                      <br />
                      <span className="time">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleTimeString(
                              "en-US"
                            )
                          : "-"}
                      </span>
                    </td>
                    {/* <td>{product.createdBy || "-"}</td> */}
                    <td className="datetime-cell">
                      {product.updateAt
                        ? new Date(product.updateAt).toLocaleDateString("en-US")
                        : "-"}
                      <br />
                      <span className="time">
                        {product.updateAt
                          ? new Date(product.updateAt).toLocaleTimeString(
                              "en-US"
                            )
                          : ""}
                      </span>
                    </td>
                    {/* <td>{product.updateBy || "-"}</td> */}
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{ marginBottom: "10px" }}
                          onClick={() => handleEdit(product)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ color: "blue", fontSize: "2.0em" }}
                            className="btn-icon"
                          />
                        </button>
                        <button onClick={() => handleDelete(product.productId)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "red", fontSize: "2.0em" }}
                            className="btn-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : currentItems.map((product, index) => (
                  <tr key={product.productId}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td>
                      {product.productImage && (
                        <img
                          src={`https://localhost:7138${product.productImage}`}
                          alt={product.title}
                          style={{
                            maxWidth: "100px",
                            cursor: "pointer",
                            borderRadius: "50%",
                          }}
                          onClick={() =>
                            handleOpenImageModal(
                              `https://localhost:7138${product.productImage}`
                            )
                          }
                        />
                      )}
                    </td>

                    {/* <td>{product.productTypeId}</td>
        <td>{product.discountId}</td>
        <td>{product.brandId}</td>
        <td>{product.supplierId}</td> */}
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit}</td>
                    <td>{product.manufacturer}</td>
                    <td>{product.isNew ? "Có" : "Không"}</td>
                    <td className="datetime-cell">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString(
                            "en-US"
                          )
                        : "-"}
                      <br />
                      <span className="time">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleTimeString(
                              "en-US"
                            )
                          : ""}
                      </span>
                    </td>
                    {/* <td>{product.createdBy || "-"}</td> */}
                    <td className="datetime-cell">
                      {product.updateAt
                        ? new Date(product.updateAt).toLocaleDateString("en-US")
                        : "-"}
                      <br />
                      <span className="time">
                        {product.updateAt
                          ? new Date(product.updateAt).toLocaleTimeString(
                              "en-US"
                            )
                          : ""}
                      </span>
                    </td>
                    {/* <td>{product.updateBy || "-"}</td> */}
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{ marginBottom: "10px" }}
                          onClick={() => handleEdit(product)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ color: "blue", fontSize: "2.0em" }}
                            className="btn-icon"
                          />
                        </button>
                        <button onClick={() => handleDelete(product.productId)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "red", fontSize: "2.0em" }}
                            className="btn-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding or editing product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {!editingProduct ? "Thêm mới Sản Phẩm" : "Chỉnh Sửa Sản Phẩm"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formProductName">
                  <Form.Label>Tên Sản Phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <Form.Group controlId="formImageUrl">
                <Form.Label>Ảnh sản phẩm</Form.Label>
                <Form.Control
                  type="file"
                  name="ImageFile"
                  onChange={handleImageChange}
                />
              </Form.Group>
              <div className="col-md-6">
                <Form.Group controlId="formProductTypeId">
                  <Form.Label>Loại Sản Phẩm</Form.Label>
                  <div className="dropdown">
                    <Form.Control
                      type="text"
                      name="productTypeName"
                      value={
                        formData.productTypeName !== null
                          ? formData.productTypeName
                          : ""
                      }
                      onClick={() => handleDropdownClick("productType")}
                      placeholder="Chọn loại sản phẩm"
                      readOnly
                    />
                    <div
                      className={`dropdown-menu${
                        showDropdown && activeDropdown === "productType"
                          ? " show"
                          : ""
                      }`}
                    >
                      {productTypes.map((productType) => (
                        <button
                          key={productType.productTypeId}
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleProductTypeSelect(productType)}
                        >
                          {productType.productTypeName}
                        </button>
                      ))}
                    </div>
                    {/* <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleDropdownClick("productType")}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </div> */}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formDiscountId">
                  <Form.Label>Giảm Giá</Form.Label>
                  <div className="dropdown">
                    <Form.Control
                      type="text"
                      name="discountValue"
                      value={formData.discountValue}
                      onClick={() => handleDropdownClick("discount")}
                      placeholder="Chọn loại giảm giá"
                      readOnly
                    />
                    <div
                      className={`dropdown-menu${
                        showDropdown && activeDropdown === "discount"
                          ? " show"
                          : ""
                      }`}
                    >
                      {discounts.map((discount) => (
                        <button
                          key={discount.discountId}
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleDiscountSelect(discount)}
                        >
                          {discount.discountValue}%
                        </button>
                      ))}
                    </div>
                    {/* <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleDropdownClick("discount")}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </div> */}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formBrandId">
                  <Form.Label>Thương Hiệu</Form.Label>
                  <div className="dropdown">
                    <Form.Control
                      type="text"
                      name="countryOfOrigin"
                      value={formData.countryOfOrigin}
                      onClick={() => handleDropdownClick("brand")}
                      placeholder="Chọn thương hiệu"
                      readOnly
                    />
                    <div
                      className={`dropdown-menu${
                        showDropdown && activeDropdown === "brand"
                          ? " show"
                          : ""
                      }`}
                    >
                      {brands.map((brand) => (
                        <button
                          key={brand.brandId}
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleBrandSelect(brand)}
                        >
                          {brand.countryOfOrigin}
                        </button>
                      ))}
                    </div>
                    {/* <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleDropdownClick("brand")}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </div> */}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formSupplierId">
                  <Form.Label>Nhà Cung Cấp</Form.Label>
                  <div className="dropdown">
                    <Form.Control
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      onClick={() => handleDropdownClick("supplier")}
                      placeholder="Chọn nhà cung cấp"
                      readOnly
                    />
                    <div
                      className={`dropdown-menu${
                        showDropdown && activeDropdown === "supplier"
                          ? " show"
                          : ""
                      }`}
                    >
                      {suppliers.map((supplier) => (
                        <button
                          key={supplier.supplierId}
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleSupplierSelect(supplier)}
                        >
                          {supplier.supplierName}
                        </button>
                      ))}
                    </div>
                    {/* <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleDropdownClick("supplier")}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </div> */}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formDescription">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formPrice">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0" 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formQuantity">
                  <Form.Label>Số Lượng</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0" 
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formUnit">
                  <Form.Label>Đơn vị tính</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập đơn vị tính"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formManufacturer">
                  <Form.Label>Nhà Sản Xuất</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập nhà sản xuất"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    
                  />
                </Form.Group>
              </div>
              <div style={{ marginTop: "50px" }} className="col-md-6">
                <Form.Group controlId="formIsNew">
                  <Form.Check
                    type="checkbox"
                    label="Sản Phẩm Mới"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formSpecialNote">
                  <Form.Label>Ghi Chú Đặc Biệt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập ghi chú đặc biệt"
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          {!editingProduct ? (
            <Button variant="primary" onClick={handleSubmit}>
              Thêm
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleSaveEdit(editingProduct.productId, formData)}
            >
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ảnh Sản Phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Product"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pagination">
        <ul>{renderPageNumbers()}</ul>
      </div>

      {/* Dropdowns */}
      {showDropdown && (
        <div className="dropdown-menu">
          {activeDropdown === "productType" && (
            <ul>
              {productTypes.map((productType) => (
                <li
                  key={productType.productTypeId}
                  onClick={() => handleProductTypeSelect(productType)}
                >
                  {productType.productTypeName}
                </li>
              ))}
            </ul>
          )}
          {activeDropdown === "discount" && (
            <ul>
              {discounts.map((discount) => (
                <li
                  key={discount.discountId}
                  onClick={() => handleDiscountSelect(discount)}
                >
                  {discount.discountValue}%
                </li>
              ))}
            </ul>
          )}
          {activeDropdown === "brand" && (
            <ul>
              {brands.map((brand) => (
                <li
                  key={brand.brandId}
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand.countryOfOrigin}
                </li>
              ))}
            </ul>
          )}
          {activeDropdown === "supplier" && (
            <ul>
              {suppliers.map((supplier) => (
                <li
                  key={supplier.supplierId}
                  onClick={() => handleSupplierSelect(supplier)}
                >
                  {supplier.supplierName}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;
