using BackEnd_DATN.Helpers;
using BackEnd_DATN.Services;
using BackEnd_DATN.Settings;
using BackEnd_DATN.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Utils = BackEnd_DATN.Utilities.Utils;

namespace VnPay.Demo.Services
{
    public interface IPaymentService
    {
        Result<string> CreateVNPayUrl(HttpContext context, decimal selectedTotalPrice, string returnUrl, int OrderId);
        Result<int> ExecuteVNPayPayment(IQueryCollection keyValuePairs);
    }

    public class PaymentService : IPaymentService
    {
        private readonly IVNPayService _vnpay;
        private readonly IOptions<VNPaySetting> _options;

        public PaymentService(IVNPayService vnpay, IOptions<VNPaySetting> options)
        {
            _vnpay = vnpay;
            _options = options;
        }

        public Result<string> CreateVNPayUrl(HttpContext context, decimal selectedTotalPrice, string returnUrl, int OrderId)
        {
            var setting = _options.Value;

            if (string.IsNullOrEmpty(setting.TmnCode) || string.IsNullOrEmpty(setting.HashSecret))
            {
                return Result<string>.Failure(ErrorMessage.NotFound);
            }

            _vnpay.AddRequestData("vnp_Version", setting.Version);
            _vnpay.AddRequestData("vnp_Command", "pay");
            _vnpay.AddRequestData("vnp_TmnCode", setting.TmnCode);
            _vnpay.AddRequestData("vnp_Amount", (selectedTotalPrice * 100).ToString());
            _vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            _vnpay.AddRequestData("vnp_CurrCode", setting.CurrCode);
            _vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            _vnpay.AddRequestData("vnp_Locale", setting.Locate);
            _vnpay.AddRequestData("vnp_OrderInfo", OrderId.ToString());
            _vnpay.AddRequestData("vnp_OrderType", "other"); //default
            _vnpay.AddRequestData("vnp_ReturnUrl", returnUrl);
            _vnpay.AddRequestData("vnp_TxnRef", OrderId.ToString());

            return Result<string>.Success(_vnpay.CreateRequestUrl(setting.BaseUrl, setting.HashSecret));
        }

        public Result<int> ExecuteVNPayPayment(IQueryCollection keyValuePairs)
        {
            foreach (var (key, value) in keyValuePairs)
            {
                if (!string.IsNullOrWhiteSpace(key) && key.StartsWith("vnp_"))
                {
                    _vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_SecureHash = _vnpay.GetResponseData("vnp_SecureHash");
            var status = _vnpay.GetResponseData("vnp_ResponseCode");

            bool checkSignature = _vnpay.ValidateSignature(vnp_SecureHash, _options.Value.HashSecret);

            if (!checkSignature || status != "00")
            {
                return Result<int>.Failure(ErrorMessage.NotFound);
            }

            var orderInfo = _vnpay.GetResponseData("vnp_OrderInfo");
            return Result<int>.Success(int.Parse(orderInfo));
        }
    }
}
