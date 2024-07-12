import React from 'react';
import Logo from '../../assets/logofood.png';
import '../../css/Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className="footer bg-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h3>ĐĂNG KÝ NHẬN THÔNG TIN</h3>
            <p>Đăng ký nhận bản tin để nhận ưu đãi đặc biệt về sản phẩm S.Fresh</p>
            <form>
              <input type="email" placeholder="Email" className="form-control" />
              <button type="submit" className="btn btn-primary mt-2 btn-block">Đăng ký</button>
            </form>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0 text-center">
            <img src={Logo} alt="Logo" className="img-fluid mb-2" />
            <h3>ND Fresh</h3>
            <p>Website thương mại điện tử S.Fresh do S Group là đơn vị chủ quản, chịu trách nhiệm và thực hiện các giao dịch liên quan mua sắm sản phẩm hàng hoá tiêu dùng thiết yếu.</p>
            <p>S.Fresh</p>
          </div>
          <div className="col-lg-4">
            <h3>LIÊN HỆ</h3>
            <p>Địa chỉ: CỬA HÀNG BÁN TRÁI CÂY CÓ ĐỊA CHỈ TẠI 65 VÕ TRỨ, TP. NHA TRANG</p>
            <p>Điện thoại: 0899086489</p>
            <p>Email: trung.tq.62cntt@ntu.edu.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
