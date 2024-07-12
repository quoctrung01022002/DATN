import axios from "axios";

const executeVNPayPayment = async (orderId) => {
  try {
    await axios.get(`https://localhost:7138/api/VnPayment/ExecuteVNPayPayment`, {
      params: {
        vnp_TxnRef: orderId
      }
    });
    console.log('Payment execution successful.');
    return true;
  } catch (error) {
    console.error('Error executing payment:', error);
    return false;
  }
};

export default executeVNPayPayment;
