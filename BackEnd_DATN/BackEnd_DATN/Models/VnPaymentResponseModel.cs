﻿namespace BackEnd_DATN.Models
{
    public class VnPaymentResponseModel
    {
        public bool Success { get; set; }
        public string PaymentMethod { get; set; }
        public string OrderDescription { get; set; }
        public string OrderId { get; set; }
        public string PaymentId { get; set; }
        public string TransactionId { get; set; }
        public string Token { get; set; }
        public string VnPayResponseCode { get; set; }
    }
    public class VnPayRequestModel
    {
        public bool FullName { get; set; }
        public string Description { get; set; }
        public string Amount { get; set; }
    }
}
