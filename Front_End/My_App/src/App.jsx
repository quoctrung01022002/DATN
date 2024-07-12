import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login-Register/LoginForm";
import RegisterForm from "./Components/Login-Register/RegisterForm";
import ForgotPasswordForm from "./Components/Login-Register/ForgotPasswordForm";
import NewPasswordForm from "./Components/Login-Register/NewPassForm";
import VerifyOtp from "./Components/Login-Register/VerifyOtp";
import Layout from "./pages/layout";
import Check from "./Components/Home/Check";
import CheckCard from "./Components/Home/CheckCard";
import Home from "./Components/Home/Home";
import ResendAndVerifyOTP from "./Components/Login-Register/ResendOtp";
import OrderDetail from "./Components/Home/OrderDetail";
import ProductDetail from "./Components/Home/ProductDetail";
import Support from "./Components/Home/Support";
import LoginAdmin from "./Components/Admin/LoginAdmin/LoginAdmin";
import Navbar from "./Components/Admin/Navbar/Navbar";
import Navbar1 from "./Components/Admin/Navbar/Navbar1";
import Layout2 from "./pages/Layout2";
import Postt from "./Components/Home/Postt";
import OrderUserId from "./Components/Admin/Order/OrderUserId";
import IntroduceMenu from "./Components/Home/IntroduceMenu";




const App = () => {
  return (
    <div className="div">
      <Routes>
      <Route element={<Layout2 />}>
      <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/navbar" element={< Navbar />} />
        <Route path="/navbar1" element={< Navbar1 />} />
      </Route>
        {/* <Route path="/footer" element={<Footer />} />
        <Route path="/header" element={<Header />} /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgotpass" element={<ForgotPasswordForm />} />
          <Route path="/newpassword" element={<NewPasswordForm />} />
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path="/check" element={<Check />} />
          <Route path="/checkcard" element={<CheckCard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orderdetail" element={<OrderDetail />} />
          <Route path="/productdetail/:productId" element={<ProductDetail />} />
          <Route path="/resendotp" element={<ResendAndVerifyOTP />} />
          <Route path="/support" element={<Support />} />
          <Route path="/postt" element={<Postt />} />
          <Route path="/orderuserid" element={<OrderUserId />} />
          <Route path="/introducemenu" element={<IntroduceMenu />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
